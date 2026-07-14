import { toSentenceCase } from "./utils"

interface FilterField {
  name: string
  label: string
  type: "select" | "daterange"
  options?: Array<{ label: string; value: string }>
  queryParam?: string
}

interface FilterConfig {
  /** The filter field name (must match the API filter key) */
  name: string
  /** Custom label for the filter (defaults to sentence-cased name) */
  label?: string
  /** Object key to use for option labels (defaults to 'name') */
  labelKey?: string
  /** Object key to use for option values (defaults to 'id') */
  valueKey?: string
  /** Query parameter name to use in API requests (defaults to name) */
  queryParam?: string
}

/**
 * Builds filter fields from API filter data with flexible configuration.
 * 
 * @param filterConfig - Array of filter configurations
 * @param filters - Filter data from API response
 * @returns Array of formatted filter fields for DataTable
 * 
 * @example
 * // String arrays (auto-generates labels)
 * buildFilterFields([{ name: "make" }], { make: ["NEXGO", "PAX"] })
 * // => [{ name: "make", label: "Make", type: "select", options: [{label: "Nexgo", value: "NEXGO"}, ...] }]
 * 
 * @example
 * // Object arrays with custom keys
 * buildFilterFields(
 *   [{ name: "countries", labelKey: "name", valueKey: "code" }],
 *   { countries: [{name: "Nigeria", code: "ng"}, {name: "USA", code: "us"}] }
 * )
 * // => [{ name: "countries", label: "Countries", type: "select", options: [{label: "Nigeria", value: "ng"}, ...] }]
 * 
 * @example
 * // Default object arrays (uses 'name' and 'id')
 * buildFilterFields([{ name: "products" }], { products: [{name: "Product A", id: "1"}] })
 * // => [{ name: "products", label: "Products", type: "select", options: [{label: "Product A", value: "1"}] }]
 * 
 * @example
 * // Date range filter
 * buildFilterFields([{ name: "dates" }], {})
 * // => [{ name: "dates", label: "Date Range", type: "daterange" }]
 * 
 * @example
 * // Mixed filters with custom labels
 * buildFilterFields([
 *   { name: "make", label: "Manufacturer" },
 *   { name: "countries", labelKey: "name", valueKey: "code" },
 *   { name: "dates" }
 * ], filters)
 */
export function buildFilterFields(filterConfig: Array<FilterConfig>, filters?: any): FilterField[] {
  return filterConfig.map(config => {
    if (config.name === "dates") {
      return { name: "dates", label: "Date Range", type: "daterange" as const }
    }
    
    const filterData = filters?.[config.name]
    const options = Array.isArray(filterData) 
      ? filterData.map((item: any) => {
          if (typeof item === 'string') {
            return { label: toSentenceCase(item), value: item }
          }
          
          const labelKey = config.labelKey || 'name'
          const valueKey = config.valueKey || 'id'
          
          return { 
            label: item[labelKey] || toSentenceCase(item[valueKey] || ''), 
            value: item[valueKey] || item[labelKey] || '' 
          }
        })
      : []
    
    return {
      name: config.name,
      label: config.label || toSentenceCase(config.name),
      type: "select" as const,
      options,
      queryParam: config.queryParam
    }
  })
}
