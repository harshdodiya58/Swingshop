import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="eyebrow text-wood flex items-center gap-3">
          {align === "center" && <span className="h-px w-8 bg-gold" aria-hidden />}
          {eyebrow}
          <span className="h-px w-8 bg-gold" aria-hidden />
        </span>
      ) : null}
      <h2 className="font-display text-3xl text-ink sm:text-4xl lg:text-[40px] lg:leading-[1.1]">
        {title}
      </h2>
      {description ? (
        <p className={cn("max-w-2xl text-base leading-7 text-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}