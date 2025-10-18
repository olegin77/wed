export type ImportedAsset = {
  sourceUrl: string;
  objectKey: string;
};

export const importFromUrl = async (url: string): Promise<ImportedAsset> => {
  // TODO: реализовать скачивание файла и загрузку в хранилище.
  const fileName = url.split('/').filter(Boolean).pop() ?? 'asset';
  return {
    sourceUrl: url,
    objectKey: `imports/${fileName}`,
  };
};
