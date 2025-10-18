export type ArchivePayload = {
  enquiryId: string;
  archivedAt: Date;
  reason?: string;
};

export const archiveEnquiry = async (payload: ArchivePayload): Promise<void> => {
  // TODO: подключить БД и фактическое архивирование.
  console.log('Archive enquiry', payload);
};

export const purgeEnquiry = async (enquiryId: string): Promise<void> => {
  // TODO: реализовать полное удаление (GDPR).
  console.log('Purge enquiry', { enquiryId });
};
