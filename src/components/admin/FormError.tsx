export function FormError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mb-4 text-sm text-red-400">{error}</p>;
}
