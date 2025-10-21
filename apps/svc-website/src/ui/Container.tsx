import React, { type HTMLAttributes, type ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  width?: "narrow" | "regular" | "wide";
}

const WIDTHS: Record<Required<ContainerProps>["width"], string> = {
  narrow: "max-w-3xl",
  regular: "max-w-6xl",
  wide: "max-w-7xl",
};

export function Container({ children, width = "regular", className, ...rest }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${WIDTHS[width]} ${className ?? ""}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export default Container;
