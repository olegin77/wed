export type SecurityAuditEvent = {
  event: string;
  actorId: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
};

export const recordSecurityEvent = (event: SecurityAuditEvent): void => {
  // TODO: интегрировать с внешним логгером/хранилищем аудита.
  console.log('security-audit', JSON.stringify(event));
};
