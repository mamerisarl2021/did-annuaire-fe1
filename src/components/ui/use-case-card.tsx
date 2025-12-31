export function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
