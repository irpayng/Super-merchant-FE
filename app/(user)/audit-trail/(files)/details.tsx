import { HeaderCard } from "@/components/ui/header-card"
import { CodeBlock } from "@/components/ui/code-block"
import { Timestamp } from "@/components/ui/timestamp"
import { toTitleCase } from "@/lib/utils"

interface AuditLogDetailsProps {
  data: any
}

export function AuditLogDetails({ data }: AuditLogDetailsProps) {
  const actorFields = [
    { label: "Name", value: data.admin?.name || data.user?.name || '-' },
    { label: "Email", value: data.admin?.email || data.user?.email || '-' },
    { label: "Type", value: data.admin ? 'Admin' : data.user ? 'User' : '-' }
  ]

  const activityFields = [
    { label: "Action", value: toTitleCase(data.action || '') },
    { label: "Description", value: data.description || '-' },
    { label: "Date", value: <Timestamp value={data.created_at} /> }
  ]

  return (
    <>
      <HeaderCard title="Actor Information" fields={actorFields} />
      <HeaderCard title="Activity Information" fields={activityFields} />

      {data.request_log && (
        <HeaderCard title="Request Log">
          <CodeBlock content={data.request_log} />
        </HeaderCard>
      )}

      {data.response_log && (
        <HeaderCard title="Response Log">
          <CodeBlock content={data.response_log} />
        </HeaderCard>
      )}

      {data.original && (
        <HeaderCard title="Original Data">
          <CodeBlock content={data.original} />
        </HeaderCard>
      )}

      {data.changes && (
        <HeaderCard title="Changes">
          <CodeBlock content={data.changes} />
        </HeaderCard>
      )}
    </>
  )
}
