export type StatusBadgeStatus =
  | "updated"
  | "deprecated"
  | "experimental"
  | "stable"
  | "beta"
  | "new";

const statusLabels: Record<StatusBadgeStatus, string> = {
  updated: "Updated",
  deprecated: "Deprecated",
  experimental: "Experimental",
  stable: "Stable",
  beta: "Beta",
  new: "New",
};

const statusStyles: Record<StatusBadgeStatus, string> = {
  updated: "border-sky-200 bg-sky-50 text-sky-700",
  deprecated: "border-red-200 bg-red-50 text-red-700",
  experimental: "border-amber-200 bg-amber-50 text-amber-700",
  stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  beta: "border-violet-200 bg-violet-50 text-violet-700",
  new: "border-lime-200 bg-lime-50 text-lime-700",
};

export interface StatusBadgeProps {
  status?: StatusBadgeStatus;
}

export default function StatusBadge({
  status = "updated",
}: StatusBadgeProps) {
  return (
    <span
      className={`mx-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
