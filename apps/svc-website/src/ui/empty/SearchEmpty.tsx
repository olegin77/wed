import React from "react";
import type { ReactNode } from "react";

const DEFAULT_SUGGESTION = "Попробуйте изменить фильтры или сбросить условия поиска.";

export interface SearchEmptyProps {
  /** Текст поискового запроса, который подсвечивается для контекста. */
  query?: string;
  /**
   * Сообщение с подсказками, как скорректировать фильтры.
   * Можно передать React-элемент со ссылками или выделениями.
   */
  suggestion?: ReactNode;
  /** Дополнительный контент под основным текстом (например, CTA-кнопки). */
  children?: ReactNode;
  /** Кастомные классы для расширения оформления блока. */
  className?: string;
}

function joinClassNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export default function SearchEmpty({
  query,
  suggestion = DEFAULT_SUGGESTION,
  children,
  className,
}: SearchEmptyProps) {
  return (
    <section
      aria-live="polite"
      className={joinClassNames("wt-search-empty", className)}
      role="status"
    >
      <p className="wt-search-empty__title">Ничего не найдено</p>
      <p className="wt-search-empty__body">
        {query ? (
          <>
            Мы не нашли результатов для запроса <strong>{query}</strong>.
          </>
        ) : (
          <>Мы не нашли подходящих результатов.</>
        )}
      </p>
      <p className="wt-search-empty__hint">{suggestion ?? DEFAULT_SUGGESTION}</p>
      {children ? <div className="wt-search-empty__actions">{children}</div> : null}
    </section>
  );
}
