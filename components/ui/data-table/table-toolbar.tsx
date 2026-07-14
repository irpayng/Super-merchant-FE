import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '../button';
import { Input } from '../input';
import { cn } from '@/lib/utils';

interface SearchFieldOption {
  label: string;
  value: string;
}

interface TableToolbarProps {
  search: string;
  searchField?: string;
  searchFields?: SearchFieldOption[];
  searchPlaceholder: string;
  selectedRowsCount: number;
  filterCount: number;
  hasFilterFields: boolean;
  hasExport: boolean;
  hasBulkDelete: boolean;
  exporting: boolean;
  refreshing: boolean;
  onSearchChange: (value: string) => void;
  onSearchFieldChange?: (value: string) => void;
  onBulkDeleteClick: () => void;
  onFilterClick: () => void;
  onExportClick: () => void;
  onRefreshClick: () => void;
  hideSearchbar?: boolean;
  hasActionBtn?: boolean;
  actionBtnText?: string;
  actionBtnOnClick?: () => void;
  actionBtnIcon?: any;
  actionBtnLoading?: boolean;
  hideRefresh?: boolean;
  hideFilter?: boolean;
}

export function TableToolbar({
  search,
  searchField,
  searchFields,
  searchPlaceholder,
  selectedRowsCount,
  filterCount,
  hasFilterFields,
  hasExport,
  hasBulkDelete,
  exporting,
  refreshing,
  onSearchChange,
  onSearchFieldChange,
  onBulkDeleteClick,
  onFilterClick,
  onExportClick,
  onRefreshClick,
  hideSearchbar,
  hasActionBtn,
  actionBtnText,
  actionBtnOnClick,
  actionBtnIcon: ActionBtnIcon,
  actionBtnLoading,
  hideRefresh,
  hideFilter,
}: TableToolbarProps) {
  const hasSearchFields = searchFields && searchFields.length > 0;

  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-2 px-6'>
      {!hideSearchbar && (
        <div className='flex flex-1 w-full sm:max-w-lg'>
          <div className='relative flex-1 min-w-0'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10' />
            <Input
              type='search'
              name='table-search'
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck={false}
              className={cn('pl-10', hasSearchFields && 'rounded-r-none border-r-0')}
              style={{ fontSize: '14px' }}
            />
          </div>
          {hasSearchFields && (
            <select
              value={searchField || ''}
              onChange={(e) => onSearchFieldChange?.(e.target.value)}
              className='shrink-0 px-3 py-3 border rounded-r-lg rounded-l-none outline-none transition-colors bg-white dark:bg-input text-sm text-foreground shadow-xs border-[#D0D5DD] dark:border-border focus:border-[#FC6401] focus:outline-none'
            >
              <option value=''>Reference</option>
              {searchFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className='flex items-center gap-2 sm:gap-3 flex-wrap'>
        {selectedRowsCount > 0 && hasBulkDelete && (
          <Button variant='danger' onClick={onBulkDeleteClick}>
            Delete ({selectedRowsCount})
          </Button>
        )}
        {hasFilterFields && !hideFilter && (
          <Button variant='secondary' icon={Filter} onClick={onFilterClick}>
            <span className='hidden sm:inline'>Filter</span>
            {filterCount > 0 && (
              <span className='ml-0 sm:ml-2 px-2 py-0.5 bg-[#FC6401] text-white rounded-full text-xs'>
                {filterCount}
              </span>
            )}
          </Button>
        )}
        {hasExport && (
          <Button
            variant='secondary'
            icon={Download}
            loading={exporting}
            onClick={onExportClick}
          >
            <span className='hidden sm:inline'>Export</span>
          </Button>
        )}

        {!hideRefresh && (
          <Button
            variant='secondary'
            icon={RefreshCw}
            loading={refreshing}
            onClick={onRefreshClick}
          >
            <span className='hidden sm:inline'>Refresh</span>
          </Button>
        )}

        {hasActionBtn && actionBtnOnClick && (
          <Button
            variant='theme'
            icon={ActionBtnIcon}
            loading={actionBtnLoading}
            onClick={actionBtnOnClick}
          >
            {actionBtnText || 'Create'}
          </Button>
        )}
      </div>
    </div>
  );
}
