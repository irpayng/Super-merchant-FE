import { use } from "react"

export function useSlugParams(params: Promise<{ [key: string]: string }>, paramName: string = 'id') {
  const resolvedParams = use(params)
  const slug = resolvedParams[paramName]
  
  const lastDashIndex = slug.lastIndexOf('-')
  const name = slug.substring(0, lastDashIndex)
  const id = slug.substring(lastDashIndex + 1)
  const displayName = name.charAt(0).toUpperCase() + name.slice(1)
  
  return { id, name, displayName, slug }
}
