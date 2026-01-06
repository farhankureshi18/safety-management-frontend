import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div>
        <h1 className="page-header">{title}</h1>
        {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
