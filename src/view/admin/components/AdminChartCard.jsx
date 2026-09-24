import { BarChart3 } from "lucide-react";

export function AdminPageHeader({ eyebrow, title, description, color = "sky" }) {
  const colorClasses = {
    sky: "bg-sky-100 text-sky-700",
    teal: "bg-teal-100 text-teal-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${colorClasses[color]}`}>
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </header>
  );
}

export function AdminChartCard({ title, description, children, accent = "sky" }) {
  const accentClasses = {
    sky: "border-sky-100",
    teal: "border-teal-100",
    amber: "border-amber-100",
    rose: "border-rose-100",
  };

  return (
    <section className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${accentClasses[accent] || accentClasses.sky}`}>
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <BarChart3 className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="p-3 sm:p-5">{children}</div>
    </section>
  );
}
