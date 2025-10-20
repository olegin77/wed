/**
 * Snapshot of an enquiry preserved for audit and GDPR purposes.
 */
export interface ArchiveRecord {
  /** Unique enquiry identifier. */
  enquiryId: string;
  /** Moment when the enquiry was archived. */
  archivedAt: Date;
  /** Optional human readable reason (spam, duplicate, GDPR etc.). */
  reason?: string;
  /** Optional user identifier that triggered the archive action. */
  archivedBy?: string;
  /** Arbitrary payload snapshot (structured enquiry data). */
  snapshot?: Record<string, unknown>;
}

/** Input payload accepted when archiving an enquiry. */
export interface ArchiveInput {
  enquiryId: string;
  reason?: string;
  archivedBy?: string;
  snapshot?: Record<string, unknown>;
  archivedAt?: Date;
}

/** Contract for a persistence backend used by the archive manager. */
export interface ArchiveStore {
  save(record: ArchiveRecord): Promise<void>;
  find(enquiryId: string): Promise<ArchiveRecord | null>;
  delete(enquiryId: string): Promise<boolean>;
  list(): Promise<ArchiveRecord[]>;
}

/** Lightweight in-memory store used for tests and local development. */
export class InMemoryArchiveStore implements ArchiveStore {
  private readonly records = new Map<string, ArchiveRecord>();

  async save(record: ArchiveRecord): Promise<void> {
    this.records.set(record.enquiryId, record);
  }

  async find(enquiryId: string): Promise<ArchiveRecord | null> {
    return this.records.get(enquiryId) ?? null;
  }

  async delete(enquiryId: string): Promise<boolean> {
    return this.records.delete(enquiryId);
  }

  async list(): Promise<ArchiveRecord[]> {
    return [...this.records.values()].sort((a, b) => a.archivedAt.getTime() - b.archivedAt.getTime());
  }
}

/** Operations exposed by the archive manager. */
export interface ArchiveManager {
  archive(input: ArchiveInput): Promise<ArchiveRecord>;
  restore(enquiryId: string): Promise<ArchiveRecord | null>;
  purge(enquiryId: string): Promise<boolean>;
  list(): Promise<ArchiveRecord[]>;
}

/**
 * Factory creating an archive manager around the provided store.
 */
export const createArchiveManager = (store: ArchiveStore = new InMemoryArchiveStore()): ArchiveManager => {
  return {
    async archive(input: ArchiveInput): Promise<ArchiveRecord> {
      if (!input.enquiryId) {
        throw new Error('enquiryId is required to archive an enquiry');
      }

      const record: ArchiveRecord = {
        enquiryId: input.enquiryId,
        archivedAt: input.archivedAt ?? new Date(),
        reason: input.reason,
        archivedBy: input.archivedBy,
        snapshot: input.snapshot,
      };

      await store.save(record);
      return record;
    },

    async restore(enquiryId: string): Promise<ArchiveRecord | null> {
      const record = await store.find(enquiryId);
      if (!record) {
        return null;
      }
      await store.delete(enquiryId);
      return record;
    },

    async purge(enquiryId: string): Promise<boolean> {
      await store.delete(enquiryId);
      return true;
    },

    async list(): Promise<ArchiveRecord[]> {
      return store.list();
    },
  };
};

const defaultManager = createArchiveManager();

export const archiveEnquiry = async (input: ArchiveInput): Promise<ArchiveRecord> => defaultManager.archive(input);

export const restoreEnquiry = async (enquiryId: string): Promise<ArchiveRecord | null> =>
  defaultManager.restore(enquiryId);

export const purgeEnquiry = async (enquiryId: string): Promise<boolean> => defaultManager.purge(enquiryId);

export const listArchivedEnquiries = async (): Promise<ArchiveRecord[]> => defaultManager.list();
