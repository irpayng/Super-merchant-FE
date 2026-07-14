"use client"

import dynamic from "next/dynamic"
import { Card } from "./card"
import { formatCurrencyAbbreviated } from "@/lib/currency"
import { useEffect, useState } from "react"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ChartSeries {
  name: string
  data: number[]
  color?: string
}

interface ChartProps {
  title: string
  action?: React.ReactNode
  series: ChartSeries[]
  categories: string[]
  type?: "line" | "bar"
  height?: number
  formatAsCurrency?: boolean
}

export function Chart({ 
  title, 
  action, 
  series, 
  categories, 
  type = "line",
  height = 350,
  formatAsCurrency = true
}: ChartProps) {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  
  const defaultColors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]
  const labelColor = isDark ? "#9CA3AF" : "#6B7280"
  
  const options: ApexCharts.ApexOptions = {
    chart: {
      type,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: type === "bar" ? defaultColors : ["#10B981", "#EF4444", "#F59E0B"],
    plotOptions: {
      bar: {
        distributed: type === "bar",
        columnWidth: "50%"
      }
    },
    stroke: {
      curve: "smooth",
      width: 2
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: labelColor, fontSize: "12px" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: labelColor, fontSize: "12px" },
        formatter: (val) => formatAsCurrency ? formatCurrencyAbbreviated(val) : val.toString()
      }
    },
    grid: {
      borderColor: isDark ? "#2A2A2A" : "#F1F1F1",
      strokeDashArray: 0
    },
    legend: { 
      show: type === "line", 
      position: "top", 
      horizontalAlign: "left",
      labels: {
        colors: labelColor
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: isDark ? "dark" : "light"
    }
  }

  const safeSeries = series.map(s => ({ ...s, data: s.data || [] }))

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-foreground" style={{ letterSpacing: '-0.304px', lineHeight: '32px' }}>
          {title}
        </h2>
        {action}
      </div>
      <ReactApexChart options={options} series={safeSeries} type={type} height={height} />
    </Card>
  )
}