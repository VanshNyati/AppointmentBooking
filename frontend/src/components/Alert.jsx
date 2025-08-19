export default function Alert({ type = "info", children }) {
  const color = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    error: "bg-rose-50 text-rose-700 border-rose-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
  }[type];

  return (
    <div className={`border rounded-xl px-3 py-2 text-sm ${color}`}>
      {children}
    </div>
  );
}
