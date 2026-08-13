import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "deep"
  | "outline"
  | "ghost"
  | "gold"
  | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-wood text-white shadow-soft hover:bg-wood-deep hover:shadow-hover active:translate-y-px",
  deep: "bg-wood-deep text-white hover:bg-wood hover:shadow-hover",
  gold: "bg-gold text-wood-deep hover:bg-wood hover:text-white",
  outline:
    "border border-line text-ink hover:border-wood hover:text-wood-deep bg-transparent",
  ghost: "text-ink hover:bg-wood/10 hover:text-wood-deep",
  whatsapp:
    "bg-[#25D366] text-white hover:brightness-95 shadow-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-[52px] px-8 text-base",
};

type VariantProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: VariantProps & { className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & VariantProps) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, className })} {...props} />
  );
}