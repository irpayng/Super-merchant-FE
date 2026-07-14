import * as React from 'react';
import { Package, MoreVertical } from 'lucide-react';
import { Badge } from '../badge';
import { Copiable } from '../copiable';
import { Truncated } from '../truncated';
import { Tooltip } from '../tooltip';
import { Timestamp } from '../timestamp';
import { formatCurrency, formatCurrencyAbbreviated } from '@/lib/currency';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import useDashboardProps from '@/components/context/dashboard-global/useDashboardProps';

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
  date?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableBodyProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable: boolean;
  showActions: boolean;
  selectedRows: Set<string>;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  rowKey: string;
  emptyStateText: string;
  emptyStateDescription?: string;
  hasActions: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onSort: (key: string) => void;
  onRowClick: (row: T) => void;
  onActionClick: (e: React.MouseEvent, row: T) => void;
}

export function TableBody<T extends Record<string, any>>({
  data,
  columns,
  selectable,
  showActions,
  selectedRows,
  sortColumn,
  sortOrder,
  rowKey,
  emptyStateText,
  emptyStateDescription,
  hasActions,
  onSelectAll,
  onSelectRow,
  onSort,
  onRowClick,
  onActionClick,
}: TableBodyProps<T>) {
  const { setActiveTableRow } = useDashboardProps()

  const getValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <table className='w-full'>
      <thead className='bg-[#F6F6F6] dark:bg-muted border-b border-[#EAECF0] dark:border-border sticky top-0 z-10'>
        <tr>
          {selectable && (
            <th className='px-6 py-3 w-12'>
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
          )}
          {columns.map((column) => (
            <th
              key={column.key}
              className={`text-${column.align || 'left'
                } px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-accent text-[#5A5A5ACC] dark:text-muted-foreground text-sm font-normal`}
              onClick={() => column.sortable && onSort(column.key)}
            >
              {column.label}
              {sortColumn === column.key && (
                <span className='ml-1'>{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
          ))}
          {showActions && hasActions && <th className='px-6 py-3 w-12'></th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={
                columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)
              }
              className='py-16'
            >
              <div className='flex flex-col items-center justify-center gap-4'>
                <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center'>
                  <Package className='h-8 w-8 text-gray-400' />
                </div>
                <div className="flexed flex-col">
                  <p className='text-base font-medium text-gray-900'>
                    {emptyStateText}
                  </p>
                  {emptyStateDescription && (
                    <p className='text-sm text-gray-500 mt-1'>
                      {emptyStateDescription}
                    </p>
                  )}
                </div>
              </div>
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr
              key={index}
              className='border-b border-[#F1F1F1] dark:border-border last:border-0 hover:bg-gray-50 dark:hover:bg-accent/50 whitespace-nowrap'
            >
              {selectable && (
                <td className='px-6 py-4 w-12'>
                  <Checkbox
                    checked={selectedRows.has(row[rowKey])}
                    onChange={(e) => onSelectRow(row[rowKey], e.target.checked)}
                  />
                </td>
              )}
              {columns.map((column) => {
                let cellContent: React.ReactNode = getValue(row, column.key);
                if (
                  cellContent === null ||
                  cellContent === undefined ||
                  cellContent === ''
                ) {
                  cellContent = '_';
                }

                if (column.render) {
                  cellContent = column.render(cellContent, row);
                } else if (column.currency === 'short') {
                  cellContent = (
                    <div>
                      <Tooltip content={formatCurrency(cellContent as number)}>
                        <p className='cursor-help'>
                          {formatCurrencyAbbreviated(cellContent as number)}
                        </p>
                      </Tooltip>
                      {column.subtitle && row[column.subtitle] && (
                        <p className='text-sm text-muted-foreground'>
                          {typeof row[column.subtitle] === 'number'
                            ? row[column.subtitle].toLocaleString()
                            : row[column.subtitle]}
                        </p>
                      )}
                    </div>
                  );
                } else if (column.currency === 'long') {
                  cellContent = formatCurrency(cellContent as string | number);
                } else if (column.badge) {
                  const variant =
                    typeof column.badge === 'function'
                      ? column.badge(cellContent)
                      : 'auto';
                  cellContent = (
                    <Badge variant={variant} value={cellContent}>
                      {cellContent}
                    </Badge>
                  );
                } else if (column.copiable) {
                  cellContent = (
                    <Copiable
                      value={String(cellContent)}
                      truncate={column.truncate}
                    />
                  );
                } else if (column.truncate) {
                  cellContent = <Truncated value={String(cellContent)} />;
                } else if (column.date) {
                  cellContent = <Timestamp value={String(cellContent)} />;
                }

                return (
                  <td
                    key={column.key}
                    className={`px-6 py-4 cursor-pointer text-${column.align || 'left'
                      } text-gray-900 dark:text-muted-foreground`}
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '1.625rem',
                      verticalAlign: 'middle',
                      ...(column.truncate || column.copiable
                        ? { width: '200px', maxWidth: '200px' }
                        : {}),
                    }}
                    onClick={() => {
                      setActiveTableRow(row)
                      onRowClick(row)
                    }}>
                    <div
                      style={
                        column.truncate || column.copiable
                          ? { width: '200px', maxWidth: '200px' }
                          : {}
                      }
                    >
                      {cellContent}
                    </div>
                  </td>
                );
              })}
              {showActions && hasActions && (
                <td className='px-6 py-4 w-12'>
                  <Button
                    onClick={(e) => {
                      setActiveTableRow(row)
                      onActionClick(e, row)
                    }}
                    variant='icon-bordered'
                  >
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
