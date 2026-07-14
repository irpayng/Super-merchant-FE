import { Button } from "@/components/ui/button"

interface FilterField {
  name: string
  label: string
  type: "text" | "select" | "date" | "daterange"
  options?: { label: string; value: string }[]
}

interface ActiveFiltersProps {
  filters: Record<string, any>
  filterFields?: FilterField[]
  onRemoveFilter: (filterName: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, filterFields, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  if (Object.keys(filters).length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap px-6">
      {filterFields?.map((field) => {
        if (field.type === "daterange") {
          const startValue = filters[`${field.name}_start`]
          const endValue = filters[`${field.name}_end`]
          if (!startValue && !endValue) return null
          
          return (
            <div key={field.name} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-muted rounded-full text-sm">
              <span className="text-gray-600 dark:text-muted-foreground">{field.label}:</span>
              <span className="font-medium text-foreground">{startValue || ''} - {endValue || ''}</span>
              <Button
                onClick={() => onRemoveFilter(field.name)}
                variant="text"
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground p-0"
              >
                ×
              </Button>
            </div>
          )
        } else {
          const value = filters[field.name]
          if (!value) return null
          
          const displayValue = field.type === "select" 
            ? field.options?.find(o => o.value === value)?.label 
            : value
          
          return (
            <div key={field.name} className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-muted rounded-full text-sm">
              <span className="text-gray-600 dark:text-muted-foreground">{field.label}:</span>
              <span className="font-medium text-foreground">{displayValue}</span>
              <Button
                onClick={() => onRemoveFilter(field.name)}
                variant="text"
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground p-0"
              >
                ×
              </Button>
            </div>
          )
        }
      })}
      <Button onClick={onClearAll} variant="link">
        Clear all
      </Button>
    </div>
  )
}
