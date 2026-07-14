export const cardColumns = [
  { key: "rrn", label: "RRN", copiable: true },
  { key: "amount", label: "Amount", currency: "long" as const },
  { key: "product.name", label: "Type" },
  { key: "card_holder", label: "Card Holder" },
  { key: "status", label: "Status", badge: true },
  { key: "created_at", label: "Date & Time", date: true, truncate: true }
]

export const transferColumns = [
  { key: "reference", label: "Reference", copiable: true, truncate: true },
  { key: "amount", label: "Amount", currency: "long" as const },
  { key: "product.name", label: "Type" },
  { key: "user.name", label: "Sender" },
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
