import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-white/30",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-foreground text-background font-medium",
        secondary:
          "border border-white/10 bg-white/5 text-foreground",
        destructive:
          "border border-red-500/20 bg-red-500/10 text-red-400",
        outline: "border-white/10 text-muted",
        violet: "border-white/15 bg-white/5 text-foreground font-mono",
        emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        zinc: "border-white/10 bg-white/5 text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
