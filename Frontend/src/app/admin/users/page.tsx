import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-zinc-100">User Moderation</h2>
        <p className="text-xs text-zinc-400">
          Review accounts, inspect storage utilization, and manage user suspensions.
        </p>
      </div>

      <AdminUsersTable />
    </div>
  );
}
