import type { AgendaBlock } from "./index";

export function agendaToPdf(blocks: AgendaBlock[]): string {
  const lines = ["Agenda"];
  blocks.forEach((block) => {
    lines.push(`${block.start} • ${block.title} (${block.durationMinutes} мин)`);
    if (block.description) {
      lines.push(`  ${block.description}`);
    }
  });
  return lines.join("\n");
}
