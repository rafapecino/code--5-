import type { ReactNode } from "react"

interface StatsWidgetProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatsWidget({ label, value, icon, trend }: StatsWidgetProps) {
  return (
    <div className="card-racing">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl md:text-4xl font-bold text-accent-highlight mt-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        {icon && <div className="text-primary text-2xl">{icon}</div>}
      </div>

      {trend && (
        <div className={`text-sm font-medium ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
          {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  )
}
