import { IpBansManager } from "@/components/admin/ip-bans-manager";

export default function AdminBansPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">IP Bans & Rate Limiting</h2>
        <p className="text-xs text-muted">
          Manage system-level IP blocks and network restrictions.
        </p>
      </div>

      <IpBansManager />
    </div>
  );
}
