import { Paperclip } from 'lucide-react';

export const columns = [
    { key: "id", label: "ID" },
    { key: "transaction_reference", label: "Transaction Ref", copiable: true, truncate: true },
    { key: "reason", label: "Reason", truncate: true },
    { key: "status_code", label: "Status", badge: true },
    {
        key: "has_attachment",
        label: "",
        width: "40px",
        render: (_: any, row: any) =>
            row.has_attachment ? (
                <Paperclip className="h-4 w-4 text-muted-foreground" aria-label="Has attachment" />
            ) : null,
    },
    { key: "created_at", label: "Date", date: true, truncate: true },
]

export const filterFields = [
    {
        name: "status",
        label: "Status",
        type: "select" as const,
        options: [
            { label: "Open", value: "open" },
            { label: "Processing", value: "processing" },
            { label: "Resolved", value: "resolved" },
            { label: "Closed", value: "closed" },
        ],
    },
    { name: "dates", label: "Date Range", type: "daterange" as const },
]
