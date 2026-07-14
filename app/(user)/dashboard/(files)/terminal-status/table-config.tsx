/* eslint-disable @next/next/no-img-element */

export const terminalStatColumns = [
  {
    key: "reference",
    label: "Terminal name",
    render: (_: any, row: any) => (
      <div className="flex items-center gap-4">
        <div className="size-10">
          <img src="/terminal-icon.png" alt="" />
        </div>
        <p className="font-medium">
          {row?.serial}
        </p>
      </div>
    ),
  },
  { key: "referencex", label: "Terminal ID" },
  { key: "status", label: "Status", badge: true },
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
