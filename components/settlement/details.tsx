import { Copiable } from "@/components/ui/copiable"
import { formatCurrency } from "@/lib/currency"
import { SettlementDetail } from "@/lib/settlement-api"

interface SettlementDetailsProps {
  data: SettlementDetail
}

export function SettlementDetails({ data }: SettlementDetailsProps) {
  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Transaction Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">RRN</div>
              <Copiable value={data.rrn.toString()} />
            </div>
            <div>
              <div className="text-sm text-gray-500">STAN</div>
              <div className="font-medium">{data.stan}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">PAN</div>
              <Copiable value={data.pan} />
            </div>
            <div>
              <div className="text-sm text-gray-500">MTI</div>
              <div className="font-medium">{data.mti}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Amount</div>
              <div className="font-medium">{formatCurrency(data.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Amount Impact</div>
              <div className="font-medium">{formatCurrency(data.amount_impact)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Acquirer Fee</div>
              <div className="font-medium">{formatCurrency(data.acquirer_fee)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Currency</div>
              <div className="font-medium">{data.currency}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Merchant Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Merchant ID</div>
              <Copiable value={data.merchant_id} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Terminal ID</div>
              <Copiable value={data.terminal_id} />
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Merchant Name</div>
              <div className="font-medium">{data.merchant_name}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Merchant Address</div>
              <div className="font-medium">{data.merchant_address}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Account Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Source Account Number</div>
              <Copiable value={data.source_account_number.toString()} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Source Account Type</div>
              <div className="font-medium">{data.source_account_type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Settlement Account Number</div>
              <Copiable value={data.settlement_account_number.toString()} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Beneficiary Account</div>
              <div className="font-medium">{data.beneficiary_account}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Card Account Number</div>
              <div className="font-medium">{data.card_account_number}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">Transaction Details</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Card Scheme</div>
              <div className="font-medium">{data.card_sheme}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Bank</div>
              <div className="font-medium">{data.bank}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Category</div>
              <div className="font-medium">{data.category}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Region</div>
              <div className="font-medium">{data.region}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Description</div>
              <div className="font-medium">{data.description}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status Message</div>
              <div className="font-medium">{data.status_message}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Response Message</div>
              <div className="font-medium">{data.response_message}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Transaction Time</div>
              <div className="font-medium">{new Date(data.transaction_time).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Created At</div>
              <div className="font-medium">{data.create_at}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
