import { AuditLogsTable } from "@/components/admin/audit-logs-table";

export default function AdminAuditPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-100">Audit Logs</h2>
        <p className="text-xs text-zinc-400">
          Immutable audit trail of administrator and security actions across the system.
        </p>
      </div>

      <AuditLogsTable />
    </div>
  );
}
