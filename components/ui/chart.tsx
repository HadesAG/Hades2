import type React from "react"

interface ChartProps {
  data: { date: string; value: number }[]
  categories: string[]
  index: string
  colors: string[]
  valueFormatter: (value: number) => string
  className?: string
}

export const AreaChart: React.FC<ChartProps> = ({ data, categories, index, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Placeholder for AreaChart */}
      <div>AreaChart: {JSON.stringify({ data, categories, index, colors, valueFormatter })}</div>
    </div>
  )
}

export const BarChart: React.FC<ChartProps> = ({ data, categories, index, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Placeholder for BarChart */}
      <div>BarChart: {JSON.stringify({ data, categories, index, colors, valueFormatter })}</div>
    </div>
  )
}
