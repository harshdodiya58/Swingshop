export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="eyebrow text-wood">Crafting your view…</p>
      </div>
    </div>
  );
}