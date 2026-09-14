import { cn } from "@/lib/utils";

export function HotBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "gold-shimmer inline-flex h-6 items-center rounded-full px-2.5 text-[10px] font-semibold tracking-[0.18em] text-night",
        className,
      )}
    >
      HOT
    </span>
  );
}

export function Spark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("spark inline-block size-1.5 rotate-45 bg-gold-bright", className)}
    />
  );
}
