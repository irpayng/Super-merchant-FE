"use client"

import dynamic from "next/dynamic"
import { Card } from "./card"
import { formatCurrency } from "@/lib/currency"
import { useEffect, useState, useMemo } from "react"

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface DonutChartProps {
  title: string
  action?: React.ReactNode
  series: number[]
  labels: string[]
  colors?: string[]
  centerLabel?: string
  centerValue?: string
  height?: number
}

export function DonutChart({ 
  title, 
  action, 
  series, 
  labels,
  colors = ["#F97316", "#EAB308", "#8B5CF6", "#6366F1"],
  centerLabel = "Total Transactions",
  centerValue = "₦521M",
  height = 350 
}: DonutChartProps) {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  
  const options: ApexCharts.ApexOptions = useMemo(() => {
    const labelColor = isDark ? "#9CA3AF" : "#6B7280"
    
    return {
      chart: {
      type: "donut"
    },
    colors,
    labels,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: centerLabel,
              fontSize: "14px",
              fontWeight: 400,
              color: labelColor,
              formatter: () => centerValue
            },
            value: {
              fontSize: "24px",
              fontWeight: 600,
              color: isDark ? "#9CA3AF" : "#000",
              formatter: (value: string) => formatCurrency(Number(value))
            }
          }
        },
        expandOnClick: false
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value)
      }
    },
    legend: {
      show: true,
      position: "right",
      fontSize: "14px",
      fontWeight: 400,
      offsetY: 0,
      height: 230,
      labels: {
        colors: labelColor
      },
      markers: {
        size: 8,
        shape: "circle" as const,
        offsetX: -10
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8
      }
    },
    stroke: {
      show: true,
      width: 10,
      colors: ["transparent"],
      lineCap: "round"
    },
    states: {
      hover: {
        filter: {
          type: "none"
        }
      },
      active: {
        filter: {
          type: "none"
        }
      }
    }
  }}, [isDark, colors, labels, centerLabel, centerValue])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-medium text-foreground" style={{ letterSpacing: '-0.304px', lineHeight: '32px' }}>
          {title}
        </h2>
        {action}
      </div>
      <ReactApexChart key={isDark ? 'dark' : 'light'} options={options} series={series} type="donut" height={height} />
    </Card>
  )
}
