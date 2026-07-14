import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TablePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TablePagination({ page, totalPages, onPageChange }: TablePaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (page > 3) pages.push('...')

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (page < totalPages - 2) pages.push('...')

    pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-between px-6 pb-6">
      <Button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        variant="filter"
        className="px-4 py-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        {getPageNumbers().map((p, idx) => 
          typeof p === 'string' ? (
            <span key={`ellipsis-${idx}`} className="text-gray-500 px-2">{p}</span>
          ) : (
            <Button
              key={p}
              onClick={() => onPageChange(p)}
              variant="text"
              className={`min-w-[40px] h-[40px] flex items-center justify-center text-sm font-medium p-0 ${
                page === p
                  ? "bg-[#FEF3F2] dark:bg-primary/10 text-[#FC6401] dark:text-primary"
                  : "text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent"
              }`}
              style={{ borderRadius: '8px' }}
            >
              {p}
            </Button>
          )
        )}
      </div>

      <Button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        variant="filter"
        className="px-4 py-2"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
