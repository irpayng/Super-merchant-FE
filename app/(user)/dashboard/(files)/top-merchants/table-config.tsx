import { TableAvatarCell } from "@/components/ui/table-avatar-cell"
import { formatCurrency } from "@/lib/currency"

export const topMerchantCols = [
  {
    key: "user.name",
    label: "Agent",
    render: (_: any, row: any) => {
      return (
        <TableAvatarCell
          title={row?.user?.name || '-'}
          subtitle={row.user?.email || '-'}
        />
      )
    }
  },
  // {
  //   key: "amount",
  //   label: "Amount", currency: "long" as const,
  // },
  {
    key: "referencex",
    label: "Performance",
    render: (_: any, row: any) => {

      return (
        <div className="text-right">

          <p className="mb-0! font-semibold text-sm">
            {formatCurrency(500000)}
          </p>

          <p className="text-xs font-light">
            5,000
          </p>
        </div>
      )
    }
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
