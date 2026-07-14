'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Modal } from '../modal';
import { Slider } from '../slider';
import { Form } from '../form';
import { Dialog } from '../dialog';
import { z } from 'zod';
import { TableHeader } from './table-header';
import { ActiveFilters } from './active-filters';
import { TableToolbar } from './table-toolbar';
import { TableBody } from './table-body';
import { TablePagination } from './table-pagination';
import { ActionMenu } from './action-menu';
import { FilterSlider } from './filter-slider';
import { Button } from '../button';
import { setRefreshHandler } from '@/lib/api';

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  copiable?: boolean;
  truncate?: boolean;
  currency?: 'long' | 'short';
  badge?:
  | boolean
  | ((value: any) => 'success' | 'warning' | 'error' | 'info' | 'default');
  subtitle?: string;
}

interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
  placeholder?: string;
  queryParam?: string;
}

interface RowAction {
  label: string;
  icon?: any;
  onClick: (row?: any) => void;
  danger?: boolean;
}

interface DataTableProps<T> {
  title?: string;
  description?: string;
  columns: Column<T>[];
  fetchData: (params: {
    page: number;
    limit: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    filters?: Record<string, any>;
  }) => Promise<{
    data: T[];
    total: number;
    filters?: Record<string, Array<{ name: string; id: string }>>;
  }>;
  createData?: (
    data: any,
    options?: { suppressToast?: boolean },
  ) => Promise<void>;
  updateData?: (id: string, data: any) => Promise<void>;
  deleteData?: (id: string) => Promise<void>;
  fetchDetails?: (id: string) => Promise<any>;
  exportData?: (params?: {
    search?: string;
    filters?: Record<string, any>;
  }) => Promise<void>;
  bulkDelete?: (ids: string[]) => Promise<void>;
  formFields?: any[] | ((filters?: Record<string, any>) => any[]);
  formSchema?: z.ZodType<any>;
  createButtonText?: string;
  searchPlaceholder?: string;
  emptyStateText?: string;
  emptyStateDescription?: string;
  pageSize?: number;
  rowKey?: string;
  selectable?: boolean;
  showActions?: boolean;
  detailsRenderer?: (data: any) => React.ReactNode;
  detailsView?: 'modal' | 'slider' | 'page';
  detailsPageUrl?: string | ((row: T) => string);
  detailsSliderWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  filterFields?: FilterField[];
  buildFilterFields?: (
    filters: Record<string, Array<{ name: string; id: string }>>,
  ) => FilterField[];
  filterConfig?: Array<{
    name: string;
    label?: string;
    labelKey?: string;
    valueKey?: string;
  }>;
  rowActions?: RowAction[];
  moreActions?: RowAction[];
  headerActions?: React.ReactNode;
  pagination?: boolean;
  reloadKey?: number;
  showSnippetOnRowClick?: boolean;
  hasActionBtn?: boolean;
  actionBtnText?: string;
  actionBtnOnClick?: () => void;
  actionBtnIcon?: any;
  actionBtnLoading?: boolean;
  hideSearchbar?: boolean;
  hideRefresh?: boolean;
  transformEditData?: (row: any) => any;
  hideFilter?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  fetchData,
  createData,
  updateData,
  deleteData,
  fetchDetails,
  exportData,
  bulkDelete,
  formFields,
  formSchema,
  createButtonText = 'Create',
  searchPlaceholder = 'Search...',
  emptyStateText = 'No data found',
  emptyStateDescription,
  pageSize = 10,
  rowKey = 'id',
  selectable = true,
  showActions = true,
  detailsRenderer,
  detailsView = 'modal',
  detailsPageUrl,
  detailsSliderWidth = '2xl',
  filterFields: initialFilterFields,
  buildFilterFields,
  filterConfig,
  rowActions,
  moreActions,
  headerActions,
  pagination = true,
  reloadKey,
  showSnippetOnRowClick,
  hasActionBtn,
  actionBtnText,
  actionBtnOnClick,
  actionBtnIcon,
  actionBtnLoading,
  hideSearchbar,
  transformEditData,
  hideRefresh,
  hideFilter,
}: DataTableProps<T>) {
  const router = useRouter();
  const [data, setData] = React.useState<T[]>([]);
  const [total, setTotal] = React.useState(0);
  const [filterFields, setFilterFields] = React.useState<FilterField[]>(
    initialFilterFields || [],
  );
  const [apiFilters, setApiFilters] = React.useState<Record<string, any>>({});
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);
  const [detailsSliderOpen, setDetailsSliderOpen] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState<string>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set(),
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState<T | null>(null);
  const [rowDetails, setRowDetails] = React.useState<any>(null);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [actionMenuOpen, setActionMenuOpen] = React.useState<string | null>(
    null,
  );
  const [menuPosition, setMenuPosition] = React.useState<{
    top: number;
    right: number;
  } | null>(null);
  const [exporting, setExporting] = React.useState(false);
  const [filterSliderOpen, setFilterSliderOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [tempFilters, setTempFilters] = React.useState<Record<string, any>>({});
  const [moreMenuOpen, setMoreMenuOpen] = React.useState<string | null>(null);
  const [moreMenuPosition, setMoreMenuPosition] = React.useState<{
    top: number;
    right: number;
  } | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const filterFieldsRef = React.useRef(filterFields);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    filterFieldsRef.current = filterFields;
  }, [filterFields]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const processedFilters = { ...filters };

      const today = new Date().toISOString().split('T')[0];
      const keysToDelete: string[] = [];

      Object.keys(processedFilters).forEach((key) => {
        if (key.endsWith('_start') && !keysToDelete.includes(key)) {
          const baseName = key.replace('_start', '');
          const endKey = `${baseName}_end`;
          const startDate = processedFilters[key] || today;
          const endDate = processedFilters[endKey] || today;
          processedFilters[baseName] = [startDate, endDate];
          keysToDelete.push(key, endKey);
        }
      });

      keysToDelete.forEach((key) => delete processedFilters[key]);

      const apiFilters: Record<string, any> = {};
      Object.keys(processedFilters).forEach((key) => {
        const field = filterFieldsRef.current.find((f) => f.name === key);
        const queryKey = field?.queryParam || key;
        apiFilters[queryKey] = processedFilters[key];
      });

      const result = await fetchData({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sort: sortColumn,
        order: sortOrder,
        filters: apiFilters,
      });
      setData(result.data);
      setTotal(result.total);
      if ((result as any).filters) {
        setApiFilters((result as any).filters);
      }
      if (result.filters) {
        if (buildFilterFields) {
          setFilterFields(buildFilterFields(result.filters));
        } else if (filterConfig) {
          const { buildFilterFields: buildFilters } =
            await import('@/lib/filter-utils');
          setFilterFields(buildFilters(filterConfig, result.filters));
        }
      }
    } catch (error: any) {
      console.error('Failed to load data:', error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    debouncedSearch,
    sortColumn,
    sortOrder,
    filters,
    fetchData,
    buildFilterFields,
    filterConfig,
  ]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    setRefreshHandler(loadData);
    return () => setRefreshHandler(() => { });
  }, [loadData]);

  React.useEffect(() => {
    if (reloadKey !== undefined) {
      setPage(1);
    }
  }, [reloadKey]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortOrder('asc');
    }
  };

  const handleCreate = async (formData: any) => {
    if (createData) {
      await createData(formData);
      setCreateModalOpen(false);
      setPage(1);
    }
  };

  const handleEdit = async (formData: any) => {
    if (updateData && currentRow) {
      await updateData(currentRow[rowKey], formData);
      setEditModalOpen(false);
      setCurrentRow(null);
    }
  };

  const handleDelete = async () => {
    if (deleteData && currentRow) {
      await deleteData(currentRow[rowKey]);
      setDeleteDialogOpen(false);
      setCurrentRow(null);
    }
  };

  const handleViewDetails = async (row: T) => {
    // if (!fetchDetails && !detailsRenderer) return;

    if (detailsView === 'page' && detailsPageUrl) {
      let url: string;
      if (typeof detailsPageUrl === 'function') {
        url = detailsPageUrl(row);
      } else {
        // Get the value from rowKey path (e.g., "provider.id" -> row.provider.id)
        const keys = rowKey.split('.');
        let value: any = row;
        let nameValue: any = row;

        for (let i = 0; i < keys.length - 1; i++) {
          value = value?.[keys[i]];
          nameValue = nameValue?.[keys[i]];
        }

        const idKey = keys[keys.length - 1];
        const id = value?.[idKey];
        const name = nameValue?.name;

        // Create slug format: name-id
        const slug = name ? `${name.toLowerCase()}-${id}` : id;
        url = detailsPageUrl.replace(':id', slug);
      }
      router.push(url);
      return;
    }

    setCurrentRow(row);
    if (detailsView === 'slider') {
      setDetailsSliderOpen(true);
    } else {
      if (showSnippetOnRowClick) {
        setDetailsModalOpen(true);
      }
    }

    if (fetchDetails) {
      setDetailsLoading(true);
      try {
        const details = await fetchDetails(row[rowKey]);
        setRowDetails(details);
      } catch (error) {
        console.error('Failed to load details:', error);
      } finally {
        setDetailsLoading(false);
      }
    } else {
      setRowDetails(row);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(data.map((row) => row[rowKey])));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleBulkDelete = async () => {
    if (bulkDelete && selectedRows.size > 0) {
      await bulkDelete(Array.from(selectedRows));
      setSelectedRows(new Set());
      setDeleteDialogOpen(false);
    } else if (deleteData && currentRow) {
      await handleDelete();
    }
  };

  const handleRemoveFilter = (filterName: string) => {
    const newFilters = { ...filters };
    if (
      filterFields?.find((f) => f.name === filterName && f.type === 'daterange')
    ) {
      delete newFilters[`${filterName}_start`];
      delete newFilters[`${filterName}_end`];
    } else {
      delete newFilters[filterName];
    }
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div
      className={`bg-card rounded-xl border border-border space-y-4 
        ${!title && 'pt-5'} ${(hideRefresh && hideSearchbar) && "!pt-0 !space-y-0"}`}>
      <TableHeader
        title={title}
        total={total}
        createData={createData}
        formFields={
          typeof formFields === 'function' ? formFields(apiFilters) : formFields
        }
        formSchema={formSchema}
        createButtonText={createButtonText}
        headerActions={headerActions}
        onCreateClick={() => setCreateModalOpen(true)}
      />

      <ActiveFilters
        filters={filters}
        filterFields={filterFields}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={() => {
          setFilters({});
          setTempFilters({});
          setPage(1);
        }}
      />

      <TableToolbar
        search={search}
        hideSearchbar={hideSearchbar}
        searchPlaceholder={searchPlaceholder}
        selectedRowsCount={selectedRows.size}
        filterCount={Object.keys(filters).length}
        hasFilterFields={!!filterFields && filterFields.length > 0}
        hasExport={!!exportData}
        hasBulkDelete={!!bulkDelete}
        exporting={exporting}
        refreshing={refreshing}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onBulkDeleteClick={() => setDeleteDialogOpen(true)}
        onFilterClick={() => {
          setTempFilters(filters);
          setFilterSliderOpen(true);
        }}
        onRefreshClick={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
        onExportClick={async () => {
          setExporting(true);
          try {
            const processedFilters = { ...filters };
            const today = new Date().toISOString().split('T')[0];
            const keysToDelete: string[] = [];

            Object.keys(processedFilters).forEach((key) => {
              if (key.endsWith('_start') && !keysToDelete.includes(key)) {
                const baseName = key.replace('_start', '');
                const endKey = `${baseName}_end`;
                const startDate = processedFilters[key] || today;
                const endDate = processedFilters[endKey] || today;
                processedFilters[baseName] = [startDate, endDate];
                keysToDelete.push(key, endKey);
              }
            });

            keysToDelete.forEach((key) => delete processedFilters[key]);

            const apiFilters: Record<string, any> = {};
            Object.keys(processedFilters).forEach((key) => {
              const field = filterFieldsRef.current.find((f) => f.name === key);
              const queryKey = field?.queryParam || key;
              apiFilters[queryKey] = processedFilters[key];
            });

            await exportData!({ search: debouncedSearch, filters: apiFilters });
          } finally {
            setExporting(false);
          }
        }}
        hasActionBtn={hasActionBtn}
        hideRefresh={hideRefresh}
        hideFilter={hideFilter}
        actionBtnText={actionBtnText}
        actionBtnOnClick={actionBtnOnClick}
        actionBtnIcon={actionBtnIcon}
        actionBtnLoading={actionBtnLoading}
      />

      <div className='relative border border-border rounded-b-lg overflow-hidden'>
        <div className='overflow-x-auto max-h-[600px] overflow-y-auto'>
          <TableBody
            data={data}
            columns={columns}
            selectable={selectable}
            showActions={showActions}
            selectedRows={selectedRows}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            rowKey={rowKey}
            emptyStateText={emptyStateText}
            emptyStateDescription={emptyStateDescription}
            hasActions={
              !!(fetchDetails || updateData || deleteData || rowActions)
            }
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onSort={handleSort}
            onRowClick={handleViewDetails}
            onActionClick={(e, row) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setMenuPosition({
                top: rect.bottom + 4,
                right: window.innerWidth - rect.right,
              });
              setActionMenuOpen(
                actionMenuOpen === row[rowKey] ? null : row[rowKey],
              );
            }}
          />
        </div>
        {loading && (
          <div className='absolute inset-0 bg-card/80 dark:bg-card/90 flex items-center justify-center z-10'>
            <Loader2
              className='h-12 w-12 animate-spin text-primary'
              style={{ strokeWidth: 1, animationDuration: '0.6s' }}
            />
          </div>
        )}
      </div>

      <ActionMenu
        isOpen={!!actionMenuOpen}
        position={menuPosition}
        rowActions={rowActions}
        currentRow={data.find((r) => r[rowKey] === actionMenuOpen)}
        hasViewDetails={!!fetchDetails}
        hasEdit={!!updateData}
        hasDelete={!!deleteData}
        onClose={() => {
          setActionMenuOpen(null);
          setMenuPosition(null);
        }}
        onViewDetails={() => {
          const row = data.find((r) => r[rowKey] === actionMenuOpen);
          if (row) handleViewDetails(row);
          setActionMenuOpen(null);
        }}
        onEdit={() => {
          const row = data.find((r) => r[rowKey] === actionMenuOpen);
          setCurrentRow(row || null);
          setEditModalOpen(true);
          setActionMenuOpen(null);
        }}
        onDelete={() => {
          const row = data.find((r) => r[rowKey] === actionMenuOpen);
          setCurrentRow(row || null);
          setDeleteDialogOpen(true);
          setActionMenuOpen(null);
        }}
      />

      {moreMenuOpen && moreMenuPosition && moreActions && (
        <>
          <div
            className='fixed inset-0 z-30'
            onClick={() => {
              setMoreMenuOpen(null);
              setMoreMenuPosition(null);
            }}
          />
          <div
            className='fixed w-64 bg-card border border-border rounded-lg shadow-lg z-40 py-1'
            style={{
              top: `${moreMenuPosition.top}px`,
              right: `${moreMenuPosition.right}px`,
            }}
          >
            {moreActions.map((action, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  const row = data.find((r) => r[rowKey] === moreMenuOpen);
                  action.onClick(row);
                  setMoreMenuOpen(null);
                }}
                variant={action.danger ? 'menu-danger' : 'menu'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </>
      )}

      {pagination && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {createData && formFields && formSchema && (
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title={`Create ${title}`}
          description={`${description}`}
          size='lg'
          closeOnOverlay={false}
        >
          <Form
            fields={
              typeof formFields === 'function'
                ? formFields(apiFilters)
                : formFields
            }
            schema={formSchema}
            onSubmit={handleCreate}
            submitText='Create'
          />
        </Modal>
      )}

      {(bulkDelete || deleteData) && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setCurrentRow(null);
          }}
          onConfirm={handleBulkDelete}
          title={currentRow ? 'Delete Item' : 'Delete Selected Items'}
          description={
            currentRow
              ? 'Are you sure you want to delete this item? This action cannot be undone.'
              : `Are you sure you want to delete ${selectedRows.size} item(s)? This action cannot be undone.`
          }
          confirmText='Delete'
          variant='danger'
        />
      )}

      {updateData && formFields && formSchema && (
        <Modal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentRow(null);
          }}
          title={`Edit ${title}`}
          size='lg'
          closeOnOverlay={false}
        >
          <Form
            fields={
              typeof formFields === 'function'
                ? formFields(apiFilters)
                : formFields
            }
            schema={formSchema}
            onSubmit={handleEdit}
            submitText='Update'
            defaultValues={
              transformEditData
                ? transformEditData(currentRow)
                : currentRow || {}
            }
          />
        </Modal>
      )}

      {detailsView === 'modal' && (
        <Modal
          open={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setCurrentRow(null);
            setRowDetails(null);
          }}
          title='Details'
          size='3xl'
        >
          {detailsLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-[#FC6401]' />
            </div>
          ) : detailsRenderer && rowDetails ? (
            detailsRenderer(rowDetails)
          ) : (
            <pre className='text-sm'>{JSON.stringify(rowDetails, null, 2)}</pre>
          )}
        </Modal>
      )}

      {detailsView === 'slider' && (
        <Slider
          open={detailsSliderOpen}
          onClose={() => {
            setDetailsSliderOpen(false);
            setCurrentRow(null);
            setRowDetails(null);
          }}
          title='Details'
          width={detailsSliderWidth}
        >
          {detailsLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-[#FC6401]' />
            </div>
          ) : detailsRenderer && rowDetails ? (
            detailsRenderer(rowDetails)
          ) : (
            <pre className='text-sm'>{JSON.stringify(rowDetails, null, 2)}</pre>
          )}
        </Slider>
      )}

      <FilterSlider
        open={filterSliderOpen}
        filterFields={filterFields}
        tempFilters={tempFilters}
        getTodayDate={getTodayDate}
        onClose={() => setFilterSliderOpen(false)}
        onTempFilterChange={setTempFilters}
        onReset={() => setTempFilters({})}
        onApply={() => {
          setFilters(tempFilters);
          setPage(1);
          setFilterSliderOpen(false);
        }}
      />
    </div>
  );
}
