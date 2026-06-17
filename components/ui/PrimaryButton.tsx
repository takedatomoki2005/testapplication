"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-card",
  secondary:
    "bg-white text-primary border border-primary hover:bg-primary-tint",
  ghost: "bg-transparent text-sub hover:text-ink"
};

export function PrimaryButton({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`w-full rounded-pill py-3.5 text-[15px] font-bold tracking-wider transition-colors ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
