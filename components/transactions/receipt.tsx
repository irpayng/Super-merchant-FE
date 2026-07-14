import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatCurrency } from "@/lib/currency"
import { toSentenceCase } from "@/lib/utils"
import { Download, X } from "lucide-react"

interface TransactionReceiptProps {
  open: boolean
  onClose: () => void
  data: any
}

export function TransactionReceipt({ open, onClose, data }: TransactionReceiptProps) {
  const handleDownload = () => {
    window.print()
  }

  const excludedFields = [
    'id',
    'reference',
    'created_at',
    'updated_at',
    'amount',
    'virtual_account_id',
    'bvn',
    'provider_reference',
    'sender_bank_code',
    'sender_account_name',
    'sender_account_number',
    'kct1',
    'kct2',
    'district',
    'unit_type',
    'is_md_bill',
    'receipt_number',
    'phone_number',
    // 'account_number',
    'default_wallet_id',
    'commission_wallet_id',
  ]

  const transactableFields = data.transactable ? Object.entries(data.transactable)
    .filter(([key]) => !excludedFields.includes(key))
    .map(([key, value]) => ({
      label: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: String(value || 'N/A')
    })) : []

  return (
    <Modal open={open} onClose={onClose} title="" size="md" showCloseButton={false}>
      <div className="space-y-4">
        <div className="flex items-center justify-between -mt-6 -mx-6 px-6 py-4 border-b border-gray-200 dark:border-border print:hidden">
          <h2 className="text-lg font-semibold text-foreground">Receipt</h2>
          <div className="flex items-center gap-2">
            <Button variant="theme" icon={Download} onClick={handleDownload}>
              Download
            </Button>
            <Button variant="secondary" icon={X} onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="print-receipt bg-white dark:bg-card border-2 border-[#FC6401] rounded-2xl p-8 space-y-4 relative print:!bg-white">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 dark:bg-background rounded-full print:!bg-gray-100"></div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 dark:bg-background rounded-full print:!bg-gray-100"></div>

          <div className="flex justify-start">
            <div className="border-2 border-[#FC6401] rounded-full px-5 py-2">
              <div className="text-xl font-bold text-[#FC6401]">IRPAY</div>
            </div>
          </div>

          <div className="pb-4 border-b border-gray-200 dark:border-border print:!border-gray-200">
            <p className="text-xs text-gray-600 dark:text-muted-foreground mb-2 print:!text-gray-600">Amount</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-gray-900 dark:text-foreground print:!text-gray-900">{formatCurrency(data.amount)}</p>
              <StatusBadge status={data.status} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex py-2">
              <span className="text-gray-600 dark:text-muted-foreground text-sm w-2/5 print:!text-gray-600">Product</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-foreground print:!text-gray-900">{toSentenceCase(data.product?.name || data.type)}</span>
            </div>

            {transactableFields.map((field, index) => (
              <div key={index} className="flex py-2">
                <span className="text-gray-600 dark:text-muted-foreground text-sm w-2/5 print:!text-gray-600">{field.label}</span>
                <span className="font-semibold text-sm text-gray-900 dark:text-foreground print:!text-gray-900">{field.value}</span>
              </div>
            ))}

            <div className="flex py-2">
              <span className="text-gray-600 dark:text-muted-foreground text-sm w-2/5 print:!text-gray-600">Date & Time</span>
              <span className="font-semibold text-sm text-gray-900 dark:text-foreground print:!text-gray-900">{data.created_at || data.date}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 dark:border-border pt-4 mt-4 print:!border-gray-300">
            <p className="text-xs text-gray-600 dark:text-muted-foreground text-center print:!text-gray-600">
              <span className="font-semibold text-gray-900 dark:text-foreground print:!text-gray-900">Disclaimer:</span> This is an auto-generated and authentic receipt. For further enquiries, please contact{" "}
              <a href="mailto:support@irpay.ng" className="text-[#FC6401] font-medium">support@irpay.ng</a>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
