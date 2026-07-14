import { HeaderCard } from "@/components/ui/header-card"
import { Timestamp } from "@/components/ui/timestamp"
import { Copiable } from "@/components/ui/copiable"
import { RequestLog } from "@/components/ui/request-log"

interface TransactionHttpLogsProps {
  data: any
}

export function TransactionHttpLogs({ data }: TransactionHttpLogsProps) {
  const httpTraffic = data?.http_traffic || []

  if (!httpTraffic.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No HTTP traffic data available
      </div>
    )
  }

  return (
    <>
      {httpTraffic.map((traffic: any, index: number) => (
        <div key={index} className="space-y-4">
          <HeaderCard 
            title={`HTTP Request ${index + 1}`}
            data={{
              "Reference": <Copiable value={traffic.reference || 'N/A'} truncate />,
              "Method": traffic.method || 'N/A',
              "URL": <Copiable value={traffic.url || 'N/A'} truncate />,
              "Status": traffic.response?.status || 'N/A',
              "Duration": `${traffic.response?.duration || 0}ms`,
              "IP": traffic.ip || 'N/A',
              "User Agent": <Copiable value={traffic.user_agent || 'N/A'} truncate />,
              "Timestamp": <Timestamp value={traffic.created_at} />
            }}
          />

          <RequestLog
            title="Request & Response"
            description="HTTP request and response data"
            request={traffic.data}
            response={traffic.response?.body}
          />
        </div>
      ))}
    </>
  )
}
