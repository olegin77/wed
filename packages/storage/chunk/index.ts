export type ChunkUploadParams = {
  objectKey: string;
  chunkSize: number;
};

export const chunkUpload = async ({ objectKey, chunkSize }: ChunkUploadParams): Promise<void> => {
  // TODO: Реализовать загрузку больших файлов по частям.
  console.log('Chunk upload scheduled', { objectKey, chunkSize });
};
