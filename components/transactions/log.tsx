import { HeaderCard } from "@/components/ui/header-card"
import { Timestamp } from "@/components/ui/timestamp"
import { getClassName, toSentenceCase } from "@/lib/utils"
import { RequestLog } from "@/components/ui/request-log"

interface TransactionLogProps {
  data: any
}

export function TransactionLog({ data }: TransactionLogProps) {
  const apiTraffic = data?.api_traffic || []

  if (!apiTraffic.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No API traffic data available
      </div>
    )
  }

  return (
    <>
      {apiTraffic.map((traffic: any, index: number) => (
        <div key={index} className="space-y-4">
          <HeaderCard 
            title={toSentenceCase(getClassName(traffic.type))}
            data={{
              "URL": traffic.url || 'N/A',
              "Method": traffic.method || 'N/A',
              "Status": traffic.client_response?.status || 'N/A',
              "Duration": `${traffic.client_response?.duration || 0}ms`,
              "Source IP": traffic.source_ip || 'N/A',
              "Timestamp": <Timestamp value={traffic.created_at} />
            }}
          />

          <RequestLog
            title="Request & Response"
            description="API request and response data"
            request={traffic.data}
            response={traffic.client_response?.data}
          />
        </div>
      ))}
    </>
  )
}
