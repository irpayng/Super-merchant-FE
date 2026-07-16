"use client"

import { HeaderCard } from "@/components/ui/header-card"

interface TerminalIdDetailsProps {
  data: any
  onClose: () => void
  useSlider?: boolean
}

export function TerminalIdDetails({ data }: TerminalIdDetailsProps) {
  return (
    <>
      <HeaderCard
        title="Terminal ID Details"
        fields={[
          { label: "Terminal ID", value: data.terminal_id, copiable: true },
          { label: "Merchant ID", value: data.merchant_id, copiable: true },
          { label: "Merchant Name", value: data.merchant_name },
          { label: "Account Number", value: data.bank_acc_no, copiable: true },
          { label: "Internal", value: data.internal ? "Yes" : "No" },
          { label: "Processor", value: data.processor || "Any" },
          { label: "Merchant Category Code", value: data.merchant_category_code },
          { label: "State Code", value: data.state_code },
          { label: "Physical Address", value: data.merchant_physical_addr },
          { label: "LGA Code", value: data.merchant_address_lga_code },
          { label: "Email", value: data.email },
          { label: "Created At", value: data.created_at }
        ]}
      />
    </>
  )
}
