import { Container } from "@/components/ui/container";

export function StaticPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-ivory">
      <header className="border-b border-line bg-cream py-14">
        <Container className="flex flex-col items-center gap-3 text-center">
          <span className="eyebrow text-wood">{eyebrow}</span>
          <h1 className="font-display text-display-sm text-ink">{title}</h1>
          {intro && <p className="max-w-xl text-muted">{intro}</p>}
        </Container>
      </header>
      <Container className="mx-auto max-w-3xl py-14">
        <div className="flex flex-col gap-6 text-base leading-8 text-ink/85">{children}</div>
      </Container>
    </div>
  );
}