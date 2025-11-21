export function Toast({ title, description, variant }) {
  const bg =
    variant === "destructive"
      ? "bg-red-600 text-white"
      : "bg-slate-800 text-white";

  return (
    <div
      className={`rounded-lg px-4 py-3 shadow-lg border border-white/10 ${bg}`}
    >
      {title && <p className="font-semibold">{title}</p>}
      {description && (
        <p className="text-sm opacity-80 mt-0.5">{description}</p>
      )}
    </div>
  );
}
