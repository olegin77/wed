// Audit log package
export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogOptions {
  enabled?: boolean;
  maxEntries?: number;
  retentionDays?: number;
}

export class AuditLogger {
  private events: AuditEvent[] = [];
  private options: Required<AuditLogOptions>;

  constructor(options: AuditLogOptions = {}) {
    this.options = {
      enabled: options.enabled ?? true,
      maxEntries: options.maxEntries ?? 10000,
      retentionDays: options.retentionDays ?? 30,
    };
  }

  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    if (!this.options.enabled) {
      return;
    }

    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.events.push(auditEvent);
    this.cleanup();
  }

  getEvents(filter?: Partial<AuditEvent>): AuditEvent[] {
    if (!filter) {
      return [...this.events];
    }

    return this.events.filter(event => {
      return Object.entries(filter).every(([key, value]) => {
        return event[key as keyof AuditEvent] === value;
      });
    });
  }

  getEventsByUser(userId: string, limit?: number): AuditEvent[] {
    const userEvents = this.events
      .filter(event => event.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? userEvents.slice(0, limit) : userEvents;
  }

  getEventsByResource(resource: string, resourceId: string): AuditEvent[] {
    return this.events
      .filter(event => event.resource === resource && event.resourceId === resourceId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private cleanup(): void {
    // Remove old events
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.options.retentionDays);
    
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
    
    // Limit number of entries
    if (this.events.length > this.options.maxEntries) {
      this.events = this.events
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.options.maxEntries);
    }
  }

  clear(): void {
    this.events = [];
  }

  getStats(): {
    totalEvents: number;
    eventsByAction: Record<string, number>;
    eventsByUser: Record<string, number>;
    eventsByResource: Record<string, number>;
  } {
    const eventsByAction: Record<string, number> = {};
    const eventsByUser: Record<string, number> = {};
    const eventsByResource: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByAction[event.action] = (eventsByAction[event.action] || 0) + 1;
      eventsByResource[event.resource] = (eventsByResource[event.resource] || 0) + 1;
      
      if (event.userId) {
        eventsByUser[event.userId] = (eventsByUser[event.userId] || 0) + 1;
      }
    });

    return {
      totalEvents: this.events.length,
      eventsByAction,
      eventsByUser,
      eventsByResource,
    };
  }
}

// Global audit logger instance
export const auditLogger = new AuditLogger();

// Utility functions
export function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
  auditLogger.log(event);
}

export function getAuditEvents(filter?: Partial<AuditEvent>): AuditEvent[] {
  return auditLogger.getEvents(filter);
}