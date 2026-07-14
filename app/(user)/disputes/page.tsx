"use client"

import { DataTable } from "@/components/ui/data-table"
import { useDataTable } from "@/hooks/useDataTable"
import { useDisputeNotifications } from "@/components/context/dispute-notifications/DisputeNotificationContext"
import { useCallback, useMemo } from "react"
import { DisputeDetails } from "./(files)/details"
import { columns, filterFields } from "./(files)/table-config"
import { disputeApi } from "@/lib/dispute-api"

export default function DisputesPage() {
    const { fetchData, fetchDetails, handleExport } = useDataTable({
        api: disputeApi,
    })
    const { isUnread, markAsRead } = useDisputeNotifications()

    // Add unread indicator column at the start
    const enrichedColumns = useMemo(() => [
        {
            key: "_unread",
            label: "",
            width: "12px",
            render: (_: any, row: any) =>
                isUnread(row.id) ? (
                    <span className="flex h-2.5 w-2.5 rounded-full bg-primary" title="New message" />
                ) : null,
        },
        ...columns,
    ], [isUnread])

    // Wrap fetchDetails to mark dispute as read when opened
    const handleFetchDetails = useCallback(async (id: string) => {
        if (!fetchDetails) return null
        const details = await fetchDetails(id)
        markAsRead(Number(id))
        return details
    }, [fetchDetails, markAsRead])

    return (
        <DataTable
            title="Disputes"
            columns={enrichedColumns}
            fetchData={fetchData}
            fetchDetails={handleFetchDetails}
            detailsView="slider"
            detailsSliderWidth="xl"
            detailsRenderer={(data) => <DisputeDetails data={data} onRefresh={() => {}} />}
            searchPlaceholder="Search disputes..."
            emptyStateText="No disputes yet"
            emptyStateDescription="Dispute records will appear here."
            filterFields={filterFields}
            selectable={false}
            exportData={handleExport}
        />
    )
}
