# WCAG 2.2 AA Checklist

| Category | Requirement | Notes |
| --- | --- | --- |
| Perceivable | Text/background contrast ≥ 4.5:1 (3:1 for large text) | Audit colour palette in Figma tokens. |
| Perceivable | Provide text alternatives for all non-decorative images | Include `alt` attributes and captions for venue galleries. |
| Perceivable | Offer captions/transcripts for video and audio content | Vendors must supply subtitles or text summaries. |
| Operable | All interactive elements reachable via keyboard | Focus order must match the visual flow. |
| Operable | Provide visible focus states | Use a consistent outline that meets contrast ratios. |
| Operable | Avoid keyboard traps | Ensure modals and drawers can be closed with ESC and focus returns. |
| Understandable | Use clear, descriptive labels and instructions | Avoid placeholder-only inputs in forms. |
| Understandable | Identify input errors and provide guidance | Inline validation with accessible error messages. |
| Robust | Use semantic HTML and ARIA only when necessary | Components must expose roles/states to assistive tech. |
| Robust | Test pages with screen readers (NVDA/VoiceOver) | Log issues in the accessibility backlog. |

## Testing cadence
- Run the checklist before each marketing release.
- Add accessibility acceptance criteria to new UI tickets.
- Track issues in the accessibility board and prioritise fixes within the next sprint.
