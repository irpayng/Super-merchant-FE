import { HeaderCard } from "@/components/ui/header-card"
import { Timestamp } from "@/components/ui/timestamp"
import { getClassName, toSentenceCase } from "@/lib/utils"
import { RequestLog } from "@/components/ui/request-log"

const ISO_FIELDS: Record<string, string> = {
  "2": "Primary Account Number",
  "3": "Processing Code",
  "4": "Amount, Transaction",
  "7": "Transmission Date & Time",
  "11": "System Trace Audit Number",
  "12": "Time, Local Transaction",
  "13": "Date, Local Transaction",
  "14": "Date, Expiration",
  "15": "Date, Settlement",
  "18": "Merchant Type",
  "22": "Point of Service Entry Mode",
  "23": "Card Sequence Number",
  "25": "Point of Service Condition Code",
  "26": "Point of Service Capture Code",
  "28": "Amount, Transaction Fee",
  "32": "Acquiring Institution ID Code",
  "35": "Track 2 Data",
  "37": "Retrieval Reference Number",
  "39": "Response Code",
  "40": "Service Restriction Code",
  "41": "Card Acceptor Terminal ID",
  "42": "Card Acceptor ID Code",
  "43": "Card Acceptor Name/Location",
  "49": "Currency Code, Transaction",
  "52": "Personal ID Number",
  "53": "Security Related Control Information",
  "54": "Additional Amounts",
  "55": "ICC Data",
  "59": "Echo Data",
  "70": "Network Management Information Code",
  "90": "Original Data Elements",
  "98": "Payee",
  "100": "Receiving Institution ID Code",
  "102": "Account Identification 1",
  "103": "Account Identification 2",
  "123": "POS Data Code",
  "127": "Private Data",
  "127.3": "Source/Destination",
  "127.6": "Original Response Code",
  "127.20": "Original Date",
  "127.22": "Original Data",
  "127.25": "ICC Data",
  "127.33": "Receiving Institution ID"
}

interface TransactionIsoLogsProps {
  data: any
}

export function TransactionIsoLogs({ data }: TransactionIsoLogsProps) {
  const isoTraffic = data?.iso_traffic || []

  const parseFields = (fields: any) => {
    if (typeof fields === 'string') {
      try {
        return JSON.parse(fields)
      } catch {
        return {}
      }
    }
    return fields || {}
  }

  const interpretFields = (fields: any, parentKey = ''): any[] => {
    const parsed = parseFields(fields)
    return Object.entries(parsed).map(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key
      const isNestedObject = typeof value === 'object' && value !== null && !Array.isArray(value)
      return {
        label: `${key} - ${ISO_FIELDS[fullKey] || ISO_FIELDS[key] || 'Unknown'}`,
        value: isNestedObject ? Object.fromEntries(
          Object.entries(value).map(([k, v]) => [
            `${k} - ${ISO_FIELDS[`${fullKey}.${k}`] || ISO_FIELDS[k] || 'Unknown'}`,
            String(v)
          ])
        ) : String(value)
      }
    })
  }

  if (!isoTraffic.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No ISO traffic data available
      </div>
    )
  }

  return (
    <>
      {isoTraffic.map((traffic: any, index: number) => (
        <div key={index} className="space-y-4">
          <HeaderCard 
            title={toSentenceCase(getClassName(traffic.class))}
            data={{
              "MTI": traffic.mti || 'N/A',
              "Response Code": traffic.response?.code || 'N/A',
              "Response Message": traffic.response?.message || 'N/A',
              "Timestamp": <Timestamp value={traffic.created_at} />
            }}
          />

          <HeaderCard 
            title="Interpreted Fields" 
            tabs={[
              { label: "Request", fields: interpretFields(traffic.fields, "127") },
              { label: "Response", fields: interpretFields(traffic.response?.fields, "127") }
            ]}
            maxHeight="400px"
          />

          <RequestLog
            title="Raw Fields"
            description="ISO 8583 raw field data"
            request={traffic.fields}
            response={traffic.response?.fields}
          />
        </div>
      ))}
    </>
  )
}
