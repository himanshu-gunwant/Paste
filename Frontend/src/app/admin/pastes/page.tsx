import { AdminPastesTable } from "@/components/admin/admin-pastes-table";

export default function AdminPastesPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">Paste Moderation</h2>
        <p className="text-xs text-muted">
          Inspect public, unlisted and deleted pastes across the platform, and execute hard purges.
        </p>
      </div>

      <AdminPastesTable />
    </div>
  );
}
