import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { ReportsQueue } from "@/components/admin/reports-queue";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <AdminStatsCards />

      {/* Immediate Attention: Open Abuse Reports Queue */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">Abuse Reports Queue</h2>
        <ReportsQueue />
      </div>
    </div>
  );
}
