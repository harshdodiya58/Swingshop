import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <Logo href="/" />
      <p className="eyebrow mt-4 text-wood">404</p>
      <h1 className="font-display text-display-sm text-ink">
        This swing seems to have swayed away
      </h1>
      <p className="max-w-md text-muted">
        The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s
        get you back to the workshop.
      </p>
      <ButtonLink href="/shop" size="lg">
        Explore Collection
      </ButtonLink>
    </Container>
  );
}