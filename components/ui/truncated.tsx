import { Tooltip } from "./tooltip"

interface TruncatedProps {
  value: string
}

export function Truncated({ value }: TruncatedProps) {
  return (
    <Tooltip content={<p>{value}</p>}>
      <span className="truncate block cursor-default">{value}</span>
    </Tooltip>
  )
}
