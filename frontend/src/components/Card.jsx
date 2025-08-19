export default function Card({ title, action, children, className = "" }) {
  return (
    <section className={`card p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between">
          {title && <h2 className="h2">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
