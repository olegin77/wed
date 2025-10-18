export interface AgendaBlock {
  id: string;
  start: string; // ISO time string HH:MM
  durationMinutes: number;
  title: string;
  description?: string;
  location?: string;
}

export interface AgendaTemplate {
  id: string;
  name: string;
  blocks: AgendaBlock[];
}

export const defaultAgendaTemplate: AgendaTemplate = {
  id: "classic-wedding",
  name: "Классическая свадьба",
  blocks: [
    {
      id: "welcome",
      start: "12:00",
      durationMinutes: 30,
      title: "Сбор гостей",
      description: "Лёгкий фуршет и приветствие гостей.",
    },
    {
      id: "ceremony",
      start: "12:30",
      durationMinutes: 45,
      title: "Церемония",
      description: "Регистрация пары и основная часть.",
    },
    {
      id: "photos",
      start: "13:15",
      durationMinutes: 45,
      title: "Фотосессия",
    },
    {
      id: "dinner",
      start: "14:00",
      durationMinutes: 120,
      title: "Праздничный ужин",
    },
    {
      id: "party",
      start: "16:00",
      durationMinutes: 180,
      title: "Вечеринка",
    },
  ],
};

export function buildAgendaFromTemplate(
  template: AgendaTemplate,
  overrides: Partial<AgendaBlock>[] = [],
): AgendaBlock[] {
  return template.blocks.map((block) => {
    const override = overrides.find((item) => item.id === block.id);
    return { ...block, ...override };
  });
}
