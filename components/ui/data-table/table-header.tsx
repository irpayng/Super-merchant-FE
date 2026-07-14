import { Plus } from "lucide-react"
import { Button } from "../button"

interface TableHeaderProps {
  title?: string
  total: number
  createData?: any
  formFields?: any[]
  formSchema?: any
  createButtonText: string
  headerActions?: React.ReactNode
  onCreateClick: () => void
}

export function TableHeader({
  title,
  total,
  createData,
  formFields,
  formSchema,
  createButtonText,
  headerActions,
  onCreateClick
}: TableHeaderProps) {
  if (!title && !createData && !headerActions) return null

  return (
    <div className="flex items-center justify-between px-6 pt-6">
      {title && (
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span
            className="px-2 py-1"
            style={{
              borderRadius: '16px',
              background: 'rgba(252, 100, 1, 0.08)',
              color: '#FC6401',
              fontSize: '12px',
              fontWeight: 500,
              lineHeight: '18px'
            }}
          >
            {total} records
          </span>
        </div>
      )}
      {!title && <div />}
      {headerActions || (createData && formFields && formSchema && (
        <Button variant="theme" icon={Plus} onClick={onCreateClick}>
          {createButtonText}
        </Button>
      ))}
    </div>
  )
}
