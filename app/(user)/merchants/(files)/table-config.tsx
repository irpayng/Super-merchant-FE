import { TableAvatarCell } from "@/components/ui/table-avatar-cell"

export const merchantCols = [
  {
    key: "user.name",
    label: "Merchant Name",
    render: (_: any, row: any) => {
      return (
        <TableAvatarCell
          title={row?.user?.name || '-'}
          subtitle={row.user?.email || '-'}
        />
      )
    }
  },
  {
    key: "reference",
    label: "Merchant ID", copiable: true, truncate: true,
  },
  {
    key: "amount",
    label: "Contact",
    render: (_: any, row: any) => {
      return (
        <p>08012345678</p>
      )
    }
  },
  {
    key: "status",
    label: "Status", badge: true,
  },
  {
    key: "amountss",
    label: "Location",
    render: (_: any, row: any) => {
      return (
        <p>13, Peterson Street, Victoria Island</p>
      )
    }
  },
  {
    key: "created_at",
    label: "Registration Date", date: true, truncate: true,
  },
]

export const transferColumns = [
  { key: "reference", label: "Merchant ID", copiable: true, truncate: true },
  { key: "amount", label: "RRN", currency: "long" as const },
  { key: "amount", label: "Amount", currency: "long" as const },
  { key: "product.name", label: "Type" },
  { key: "status.description", label: "Sender" },
  { key: "status", label: "Status", badge: true },
  { key: "created_at", label: "Date & Time", date: true, truncate: true }
]

export const filters = [
  { name: "statuses", label: "Status", queryParam: "status" },
  // { name: "products", label: "Product", queryParam: "product" },
  // { name: "providers", label: "Provider", queryParam: "provider" },
  // { name: "channels", label: "Channel", queryParam: "channel" },
  { name: "payment_methods", label: "Payment Method", queryParam: "payment_method" },
  { name: "dates" }
]
