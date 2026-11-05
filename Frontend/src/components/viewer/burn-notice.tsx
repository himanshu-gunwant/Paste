import { Flame } from "lucide-react";

interface BurnNoticeProps {
  burnedAt?: string | null;
}

export function BurnNotice({ burnedAt }: BurnNoticeProps = {}) {
  return (
    <div className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 rounded-md px-4 py-2.5 text-xs text-red-300">
      <Flame className="h-4 w-4 shrink-0 text-red-400 animate-pulse" />
      <span>
        <strong>Burn-After-Reading Active:</strong> This paste has been consumed and deleted from the database.
        It will not be accessible if you refresh or close this tab.
        {burnedAt && <span className="ml-1 opacity-75">Burned at {new Date(burnedAt).toLocaleTimeString()}.</span>}
      </span>
    </div>
  );
}
