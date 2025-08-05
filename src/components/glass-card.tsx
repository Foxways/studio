import { cn } from "@/lib/utils"

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>

export function GlassCard({ className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-card/30 p-6 shadow-lg backdrop-blur-lg md:p-8",
        className
      )}
      {...props}
    />
  )
}
