export interface OnboardingStep {
  /** Unique identifier used to persist completion state */
  id: string;
  /** Short title rendered in checklists or banners */
  title: string;
  /** Helpful context about the step. */
  description: string;
  /** Deep-link or command to jump directly to the feature. */
  action: string;
  /** Optional dependencies that should be completed first. */
  dependsOn?: string[];
}

export const defaultOnboardingFlow: OnboardingStep[] = [
  {
    id: "complete-profile",
    title: "Заполните профиль",
    description: "Добавьте логотип, контактные данные и описание, чтобы вас видели пары.",
    action: "/dashboard/profile",
  },
  {
    id: "add-offer",
    title: "Создайте первое предложение",
    description: "Загрузите тарифы и фото, чтобы появиться в каталоге.",
    action: "/dashboard/offers/new",
    dependsOn: ["complete-profile"],
  },
  {
    id: "connect-payments",
    title: "Подключите оплату",
    description: "Привяжите банковский счёт или карту для быстрого получения платежей.",
    action: "/dashboard/settings/payments",
    dependsOn: ["complete-profile"],
  },
  {
    id: "invite-team",
    title: "Пригласите команду",
    description: "Добавьте менеджеров и фотографов, чтобы делиться доступом.",
    action: "/dashboard/team",
    dependsOn: ["complete-profile"],
  },
  {
    id: "publish-website",
    title: "Опубликуйте мини-сайт",
    description: "Активируйте страницу на платформе, чтобы пары могли оставить заявку.",
    action: "/dashboard/website",
    dependsOn: ["add-offer"],
  },
];

export function getPendingOnboardingSteps(
  completed: Iterable<string>,
  steps: OnboardingStep[] = defaultOnboardingFlow,
): OnboardingStep[] {
  const done = new Set(completed);
  return steps.filter((step) => {
    if (done.has(step.id)) return false;
    return (step.dependsOn ?? []).every((dep) => done.has(dep));
  });
}
