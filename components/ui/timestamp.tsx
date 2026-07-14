interface TimestampProps {
  value: string | null | undefined
}

export function Timestamp({ value }: TimestampProps) {
  if (!value) return <span>N/A</span>
  
  const date = new Date(value)
  if (isNaN(date.getTime())) return <span>{value}</span>
  
  return <span>{date.toLocaleString('en-GB', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })}</span>
}
