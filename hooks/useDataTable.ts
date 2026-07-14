import { useCallback, useRef, useEffect } from 'react'
import { normalizePaginatedResponse } from '@/lib/pagination-utils'
import { useToast } from '@/components/ui/toast'
import { BaseApi } from '@/lib/base-api'

interface UseDataTableOptions<T> {
  api: BaseApi<T> | { getItems: (params: any) => Promise<any>; getItem?: (id: string) => Promise<any>; downloadItems?: (params: any) => Promise<void>; uploadSerials?: (file: File) => Promise<any>; uploadSettlement?: (file: File) => Promise<any>; uploadTerminalIds?: (file: File) => Promise<any> }
  onStatsUpdate?: (stats: any) => void
  onFiltersUpdate?: (filters: any) => void
  defaultParams?: Record<string, any>
  onUploadSuccess?: () => void
}

export function useDataTable<T>({ api, onStatsUpdate, onFiltersUpdate, defaultParams, onUploadSuccess }: UseDataTableOptions<T>) {
  const { showToast } = useToast()
  const apiRef = useRef(api)
  const onStatsUpdateRef = useRef(onStatsUpdate)
  const onFiltersUpdateRef = useRef(onFiltersUpdate)
  const defaultParamsRef = useRef(defaultParams)
  const onUploadSuccessRef = useRef(onUploadSuccess)

  useEffect(() => {
    apiRef.current = api
    onStatsUpdateRef.current = onStatsUpdate
    onFiltersUpdateRef.current = onFiltersUpdate
    defaultParamsRef.current = defaultParams
    onUploadSuccessRef.current = onUploadSuccess
  })

  const fetchData = useCallback(async (params: any) => {
    const response = await apiRef.current.getItems({ 
      page: params.page, 
      limit: params.limit, 
      search: params.search, 
      ...params.filters,
      ...defaultParamsRef.current
    })
    
    if (response.stats && onStatsUpdateRef.current) {
      onStatsUpdateRef.current(response.stats)
    }
    
    if (response.filters && onFiltersUpdateRef.current) {
      onFiltersUpdateRef.current(response.filters)
    }
    
    const normalized = normalizePaginatedResponse(response, params.limit)
    return { ...normalized, roles: (response as any).roles }
  }, [])

  const fetchDetails = useCallback(async (id: string) => {
    if (!apiRef.current.getItem) return null
    const response = await apiRef.current.getItem(id)
    return response.data
  }, [])

  const handleExport = useCallback(async (params?: any) => {
    if (!apiRef.current.downloadItems) return
    await apiRef.current.downloadItems({ search: params?.search, ...params?.filters })
  }, [])

  const handleUpload = useCallback(async (file: File, uploadMethod: 'uploadSerials' | 'uploadSettlement' | 'uploadTerminalIds', successMessage: string) => {
    const api = apiRef.current as any
    const method = api[uploadMethod]
    if (!method) return
    
    await method(file)
    if (onUploadSuccessRef.current) {
      onUploadSuccessRef.current()
    }
  }, [])

  return {
    fetchData,
    fetchDetails: apiRef.current.getItem ? fetchDetails : undefined,
    handleExport: apiRef.current.downloadItems ? handleExport : undefined,
    handleUpload: ((apiRef.current as any).uploadSerials || (apiRef.current as any).uploadSettlement || (apiRef.current as any).uploadTerminalIds) ? handleUpload : undefined
  }
}
