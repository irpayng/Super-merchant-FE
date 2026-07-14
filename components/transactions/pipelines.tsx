import { HeaderCard } from "@/components/ui/header-card"
import { Timestamp } from "@/components/ui/timestamp"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/ui/code-block"
import { toSentenceCase } from "@/lib/utils"

interface TransactionPipelinesProps {
  data: any
}

export function TransactionPipelines({ data }: TransactionPipelinesProps) {
  const pipelines = data?.pipelines || []

  if (!pipelines.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No pipeline data available
      </div>
    )
  }

  return (
    <>
      {pipelines.map((pipeline: any, index: number) => (
        <HeaderCard key={index} title={`${pipeline.sequence}. ${toSentenceCase(pipeline.name)}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
              <Badge variant={pipeline.error ? "error" : "success"}>
                {pipeline.error ? "Error" : "Success"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timestamp</p>
              <p className="font-semibold"><Timestamp value={pipeline.created_at} /></p>
            </div>
            {pipeline.error && (
              <div className="col-span-2">
                <CodeBlock content={pipeline.error} />
              </div>
            )}
          </div>
        </HeaderCard>
      ))}
    </>
  )
}
