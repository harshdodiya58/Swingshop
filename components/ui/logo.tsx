import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";

export function Logo({
  href = "/",
  className,
  tone = "dark",
}: {
  href?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-3 leading-none", className)}
      aria-label="Shree Chamunda Swings — home"
    >
      <LogoMark tone={tone} className="h-11 w-11 shrink-0" />
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-[22px] font-medium tracking-tight transition-colors",
            tone === "dark" ? "text-ink group-hover:text-wood-deep" : "text-ivory",
          )}
        >
          Shree Chamunda
        </span>
        <span
          className={cn(
            "eyebrow mt-0.5 flex items-center gap-1.5 text-[10px] tracking-[0.34em]",
            tone === "dark" ? "text-wood" : "text-gold",
          )}
        >
          <span
            className={cn(
              "h-px w-4",
              tone === "dark" ? "bg-gold" : "bg-gold/70",
            )}
            aria-hidden
          />
          Swings
        </span>
      </span>
    </Link>
  );
}
