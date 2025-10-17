export type Hint = { id: string; text: string };

export const enquiryHints: Hint[] = [
  { id: 'budget', text: 'Уточните бюджет и диапазон дат, чтобы получить точные предложения.' },
  { id: 'guests', text: 'Укажите примерное число гостей — это поможет подобрать площадку подходящего размера.' },
  { id: 'extras', text: 'Расскажите о дополнительных услугах (кейтеринг, декор), чтобы вендор мог подготовить пакет.' },
];

export const getEnquiryHintById = (id: string): Hint | undefined =>
  enquiryHints.find((hint) => hint.id === id);
