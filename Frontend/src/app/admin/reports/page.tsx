import { ReportsQueue } from "@/components/admin/reports-queue";

export default function AdminReportsPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">Abuse Reports</h2>
        <p className="text-xs text-muted">
          Review community reports for spam, malware, harassment, and copyright violations.
        </p>
      </div>

      <ReportsQueue />
    </div>
  );
}
