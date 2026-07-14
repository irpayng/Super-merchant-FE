import { ReactNode } from "react"
import { formatCurrency, formatCurrencyAbbreviated } from "@/lib/currency"
import { Tooltip } from "./tooltip"

interface Column {
  key: string
  label: string
  className?: string
  render?: (value: any, row: any) => ReactNode
  currency?: "long" | "short"
  subtitle?: string
}

interface SimpleTableProps {
  title?: string
  seeAllLink?: string
  columns: Column[]
  data: any[]
}

export function SimpleTable({ title, seeAllLink, columns, data }: SimpleTableProps) {
  return (
    <div className="flex flex-col">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium text-foreground" style={{ letterSpacing: '-0.304px', lineHeight: '32px' }}>
            {title}
          </h2>
          {seeAllLink && (
            <a 
              href={seeAllLink}
              className="flex items-start justify-center rounded-md border border-[#F1F1F1] dark:border-border text-foreground text-sm hover:bg-gray-50 dark:hover:bg-accent"
              style={{ padding: '4px 8px', fontSize: '14px', lineHeight: '24px', letterSpacing: '-0.084px', fontWeight: 400 }}
            >
              See all
            </a>
          )}
        </div>
      )}
      <div className="overflow-x-auto overflow-y-auto flex-1 -mx-4 sm:mx-0">
        <table className="w-full" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr className="border-b border-[#EAECF0] dark:border-border bg-[#F6F6F6] dark:bg-muted">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6 text-[#5A5A5ACC] dark:text-muted-foreground ${column.className || ''}`}
                  style={{ height: '44px', padding: '12px 16px', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, lineHeight: '1.25rem' }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b border-[#F1F1F1] dark:border-border last:border-0">
                {columns.map((column) => (
                  <td key={column.key} className={`first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6 text-foreground ${column.className || ''}`} style={{ padding: '16px', fontSize: '14px', fontStyle: 'normal', fontWeight: 500, lineHeight: '1.625rem', verticalAlign: 'middle' }}>
                    {column.render ? column.render(row[column.key], row) : (
                      <div>
                        {column.currency === "short" && typeof row[column.key] === 'number' ? (
                          <Tooltip content={formatCurrency(row[column.key])}>
                            <p className="cursor-help">{formatCurrencyAbbreviated(row[column.key])}</p>
                          </Tooltip>
                        ) : column.currency === "long" && typeof row[column.key] === 'number' ? (
                          formatCurrency(row[column.key])
                        ) : (
                          <p>{row[column.key]}</p>
                        )}
                        {column.subtitle && row[column.subtitle] && (
                          <p className="text-sm text-muted-foreground">{typeof row[column.subtitle] === 'number' ? row[column.subtitle].toLocaleString() : row[column.subtitle]}</p>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}