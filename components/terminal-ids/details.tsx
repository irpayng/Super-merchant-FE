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
          { label: "Bank Code", value: data.bank_code },
          { label: "Account Number", value: data.bank_acc_no, copiable: true },
          { label: "Merchant Category Code", value: data.merchant_category_code },
          { label: "State Code", value: data.state_code },
          { label: "PTSP Code", value: data.ptsp_code },
          { label: "Contact Name", value: data.contact_name },
          { label: "Contact Title", value: data.contact_title },
          { label: "Mobile Phone", value: data.mobile_phone },
          { label: "Email", value: data.email },
          { label: "Physical Address", value: data.merchant_physical_addr },
          { label: "Business Occupation Code", value: data.business_occupation_code },
          { label: "Visa Acquirer ID", value: data.visa_acquirer_id_number },
          { label: "Verve Acquirer ID", value: data.verve_acquirer_id_number },
          { label: "Mastercard Acquirer ID", value: data.mastercard_acquirer_id_number },
          { label: "Terminal Owner Code", value: data.terminal_owner_code },
          { label: "Merchant Account Name", value: data.merchant_account_name },
          { label: "Domicile Bank Code", value: data.merchant_acct_domicile_bank_code },
          { label: "Terminal Group ID", value: data.terminal_group_id },
          { label: "BVN", value: data.bvn },
          { label: "TIN", value: data.tin },
          { label: "Merchant LGA Code", value: data.merchant_address_lga_code },
          { label: "Agent Code", value: data.agent_code },
          { label: "GPS Info", value: data.gps_info },
          { label: "Terminal LGA Code", value: data.terminal_address_lga_code },
          { label: "Terminal Address", value: data.terminal_address },
          { label: "Merchant Acquirer ID", value: data.merchant_acquirer_id },
          { label: "Terminal Model", value: data.terminal_model_description },
          { label: "App Name", value: data.app_name },
          { label: "App Version", value: data.app_version },
          { label: "Terminal Type", value: data.terminal_type },
          { label: "Created At", value: data.created_at }
        ]}
      />
    </>
  )
}
