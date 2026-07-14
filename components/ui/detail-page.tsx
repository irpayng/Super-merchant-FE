"use client"

import { DataTable } from "@/components/ui/data-table"
import { useSlugParams } from "@/hooks/useSlugParams"
import { useDataTable } from "@/hooks/useDataTable"
import { useEffect, useState } from "react"

interface DetailPageProps {
  params: Promise<{ [key: string]: string }>
  paramName: string
  api: any
  filterKey: string
  title: string
  columns: any[]
  detailsRenderer?: (data: any) => React.ReactNode
  detailsView?: "modal" | "slider" | "page"
  detailsSliderWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  searchPlaceholder?: string
  emptyStateText?: string
  emptyStateDescription?: string
  children?: (params: { id: string; slugName: string; displayName: string }) => React.ReactNode
}

export function DetailPage({
  params,
  paramName,
  api,
  filterKey,
  title,
  columns,
  detailsRenderer,
  detailsView = "slider",
  detailsSliderWidth = "2xl",
  searchPlaceholder = "Search...",
  emptyStateText = "No data yet",
  emptyStateDescription = "Records will appear here.",
  children
}: DetailPageProps) {
  const { id, name, displayName } = useSlugParams(params, paramName)

  const { fetchData, fetchDetails, handleExport } = useDataTable({
    api,
    defaultParams: { [filterKey]: id }
  })

  useEffect(() => {
    document.title = `${title} - ${displayName}`
  }, [displayName, title])

  return (
    <>
      {typeof children === 'function' ? children({ id, slugName: name, displayName }) : children}
      <DataTable
        title={`${title} - ${displayName}`}
        columns={columns}
        fetchData={fetchData}
        fetchDetails={fetchDetails}
        detailsView={detailsView}
        detailsSliderWidth={detailsSliderWidth}
        detailsRenderer={detailsRenderer}
        searchPlaceholder={searchPlaceholder}
        emptyStateText={emptyStateText}
        emptyStateDescription={emptyStateDescription}
        selectable={true}
        showActions={false}
        exportData={handleExport}
      />
    </>
  )
}
