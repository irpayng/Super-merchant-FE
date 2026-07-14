import { Button } from "@/components/ui/button"
import { HeaderCard } from "@/components/ui/header-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timestamp } from "@/components/ui/timestamp"
import { formatCurrency } from "@/lib/currency"
import { toTitleCase } from "@/lib/utils"
import { FileText, ScrollText, GitBranch } from "lucide-react"
import { Card } from "../ui/card"

interface TransactionDetailsProps {
  data: any
  onViewReceipt?: () => void
  onViewLog?: () => void
  onViewPipelines?: () => void
  onViewIsoLogs?: () => void
  onViewHttpLogs?: () => void
  onRaiseDispute?: () => void
  onViewMerchantReceipt?: () => void
  onViewCustomerReceipt?: () => void
  hidePipelineBtn?: boolean;
  hideLogsBtn?: boolean;
  hideDefaultRcptBtn?: boolean;
}

export function TransactionDetails({
  data,
  onViewReceipt,
  onViewLog,
  onViewPipelines,
  onViewIsoLogs,
  onViewHttpLogs,
  onRaiseDispute,
  onViewCustomerReceipt,
  onViewMerchantReceipt,
  hideDefaultRcptBtn,
  hideLogsBtn,
  hidePipelineBtn,
}: TransactionDetailsProps) {
  const productName = data.product?.name?.toLowerCase()
  const showIsoLogs = productName === 'withdrawal' || productName === 'purchase'
  const hasHttpTraffic = data?.http_traffic && data.http_traffic.length > 0
  const transactionFields = [
    { label: "Reference", value: data.reference || '', copiable: true, truncate: true },
    { label: "Date", value: <Timestamp value={data.created_at || data.date} /> },
    { label: "Product", value: data.product?.name || data.type || '' },
    { label: "Provider", value: data.provider?.name || '' },
    { label: "Channel", value: data.channel?.name || '' },
    { label: "Payment Method", value: data.payment_method?.name || data.paymentMethod || '' }
  ]

  const excludedFields = [
    'id', 'reference', 'created_at', 'updated_at', 'bvn', 'amount', 'narration',
    'virtual_account_id', 'sender_account_name', 'sender_account_number',
    'sender_bank_code', 'sender_bank_name'
  ]
  const copiableFields = ['session_id', 'provider_reference']
  const truncateFields = ['session_id', 'provider_reference']

  const showDisputeBtn = onRaiseDispute !== undefined;
  const showCustomerRcptBtn = onViewCustomerReceipt !== undefined
  const showMerchantRcptBtn = onViewMerchantReceipt !== undefined

  const transactableFields = data.transactable ? Object.entries(data.transactable)
    .filter(([key]) => !excludedFields.includes(key))
    .map(([key, value]) => ({
      label: toTitleCase(key),
      value: String(value || ''),
      copiable: copiableFields.includes(key),
      truncate: truncateFields.includes(key)
    })) : []

  const userFields = [
    { label: "Full Name", value: data.user?.name || '' },
    { label: "User ID", value: String(data.user?.id || '') }
  ]

  const costFields = [
    { label: "Transaction Amount", value: formatCurrency(data.amount) },
    { label: "Transaction Fee", value: formatCurrency(data.fee || 50) },
    { label: "Service Charge", value: formatCurrency(data.service_charge || 0) }
  ]

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">

        {showDisputeBtn && (
          <Button variant="secondary" onClick={onRaiseDispute}>
            Raise Dispute
          </Button>
        )}

        {showCustomerRcptBtn && (
          <Button variant="secondary" onClick={onViewCustomerReceipt}>
            View Customer Receipt
          </Button>
        )}

        {showMerchantRcptBtn && (
          <Button variant="secondary" onClick={onViewMerchantReceipt}>
            View Merchant Receipt
          </Button>
        )}

        {!hidePipelineBtn && (
          <Button variant="secondary" icon={GitBranch} onClick={onViewPipelines}>
            Pipelines
          </Button>
        )}

        {(hasHttpTraffic && !hideLogsBtn) && (
          <Button variant="secondary" icon={ScrollText} onClick={onViewHttpLogs}>
            HTTP Logs
          </Button>
        )}

        {!hideLogsBtn && (
          <Button variant="secondary" icon={ScrollText} onClick={showIsoLogs ? onViewIsoLogs : onViewLog}>
            {showIsoLogs ? 'ISO Logs' : 'API Logs'}
          </Button>
        )}

        {!hideDefaultRcptBtn && (
          <Button variant="theme" icon={FileText} onClick={onViewReceipt}>
            Receipt
          </Button>
        )}

      </div>
      <Card>
        <div className="space-y-4">
          <div className="">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Amount</p>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-semibold">{formatCurrency(data.amount)}</p>
              <StatusBadge status={data.status} />
            </div>
          </div>
        </div>
      </Card>

      <HeaderCard title="Transaction Information" fields={transactionFields} />

      {transactableFields.length > 0 && (
        <HeaderCard title="Transaction Details" description="Specific details for this transaction type" fields={transactableFields} />
      )}

      <HeaderCard title="User Information" description="Details of the user who performed this transaction" fields={userFields} />

      <HeaderCard title="Cost Breakdown" description="Detailed breakdown of transaction costs" fields={costFields} />
    </>
  )
}
