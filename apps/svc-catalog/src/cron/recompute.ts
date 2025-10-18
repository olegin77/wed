export const recomputeRankCron = {
  cron: '0 * * * *',
  description: 'Ежечасный пересчет скорингов каталога',
};

export const handler = async () => {
  // TODO: подключить реализацию пересчета рангов каталога.
  return { ok: true };
};
