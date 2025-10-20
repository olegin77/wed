export type SecurityAuditSeverity = "info" | "warning" | "critical";

export interface SecurityAuditEvent {
  type: string;
  actorId: string;
  resource?: string;
  severity?: SecurityAuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

export interface NormalisedSecurityAuditEvent extends Required<Omit<SecurityAuditEvent, "metadata" | "createdAt" | "severity" >> {
  metadata: Record<string, unknown>;
  createdAt: Date;
  severity: SecurityAuditSeverity;
}

export interface SecurityAuditSink {
  write(event: NormalisedSecurityAuditEvent): Promise<void> | void;
}

const SENSITIVE_KEYS = [/password/i, /secret/i, /token/i, /key$/i];

/** Masks sensitive values inside audit metadata. */
export const sanitiseMetadata = (metadata: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!metadata) {
    return {};
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.some((pattern) => pattern.test(key))) {
      result[key] = "[redacted]";
    } else {
      result[key] = value;
    }
  }
  return result;
};

const ensureNonEmpty = (value: string, field: string) => {
  if (!value) {
    throw new Error(`Security audit event requires ${field}`);
  }
  return value;
};

const normaliseEvent = (event: SecurityAuditEvent, now: () => Date): NormalisedSecurityAuditEvent => {
  return {
    type: ensureNonEmpty(event.type, "type"),
    actorId: ensureNonEmpty(event.actorId, "actorId"),
    resource: event.resource ?? "unknown",
    severity: event.severity ?? "info",
    ipAddress: event.ipAddress ?? "unknown",
    userAgent: event.userAgent ?? "unknown",
    metadata: sanitiseMetadata(event.metadata),
    createdAt: event.createdAt ?? now(),
  };
};

export interface SecurityAuditLoggerOptions {
  sinks: SecurityAuditSink[];
  clock?: () => Date;
}

/**
 * Creates a security audit logger that dispatches normalised events to the provided sinks.
 */
export const createSecurityAuditLogger = ({ sinks, clock = () => new Date() }: SecurityAuditLoggerOptions) => {
  if (!Array.isArray(sinks) || sinks.length === 0) {
    throw new Error("At least one audit sink must be provided");
  }
  return {
    async record(event: SecurityAuditEvent): Promise<NormalisedSecurityAuditEvent> {
      const normalised = normaliseEvent(event, clock);
      await Promise.all(sinks.map((sink) => sink.write(normalised)));
      return normalised;
    },
  };
};

/** Simple console sink used in development environments. */
export const createConsoleSink = (logger: typeof console = console): SecurityAuditSink => ({
  write(event) {
    logger.info("security-audit", JSON.stringify(event));
  },
});

/** In-memory sink primarily for tests. */
export const createMemorySink = () => {
  const events: NormalisedSecurityAuditEvent[] = [];
  return {
    write(event: NormalisedSecurityAuditEvent) {
      events.push(event);
    },
    all(): NormalisedSecurityAuditEvent[] {
      return events;
    },
  } satisfies SecurityAuditSink & { all(): NormalisedSecurityAuditEvent[] };
};

const defaultLogger = createSecurityAuditLogger({ sinks: [createConsoleSink()] });

export const recordSecurityEvent = async (event: SecurityAuditEvent): Promise<NormalisedSecurityAuditEvent> =>
  defaultLogger.record(event);
