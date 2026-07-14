'use client';

import * as React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { Copiable } from './copiable';
import { Button } from './button';
import { Badge } from './badge';

interface HeaderCardField {
  label: string;
  value: string | Record<string, any> | React.ReactNode;
  copiable?: boolean;
  truncate?: boolean;
  badge?:
    | boolean
    | ((value: any) => 'success' | 'warning' | 'error' | 'info' | 'default');
}

interface HeaderCardTab {
  label: string;
  fields: HeaderCardField[];
}

interface HeaderCardProps {
  title: string | React.ReactNode;
  description?: string;
  data?: Record<string, any>;
  fields?: HeaderCardField[];
  tabs?: HeaderCardTab[];
  children?: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  maxHeight?: string;
}

export function HeaderCard({
  title,
  description,
  data,
  fields,
  tabs,
  children,
  className,
  headerAction,
  maxHeight,
}: HeaderCardProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Card className={cn('', className)}>
      <div className='pb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-base font-semibold text-foreground'>{title}</h2>
          {description && (
            <p className='text-xs text-muted-foreground mt-0.5'>
              {description}
            </p>
          )}
        </div>
        {headerAction}
      </div>
      <div className='border-t border-border' />
      {tabs && tabs.length > 0 && (
        <div className='flex border-b border-gray-200 dark:border-border'>
          {tabs.map((tab, index) => (
            <Button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              variant='text'
              className={`px-4 py-3 text-sm font-medium p-0 rounded-none ${
                activeTab === index
                  ? 'text-[#FC6401] border-b-2 border-[#FC6401]'
                  : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      )}
      <div
        className='pt-4 flex-1 overflow-y-auto'
        style={maxHeight ? { maxHeight } : undefined}
      >
        {tabs && tabs.length > 0 ? (
          <div className='space-y-0'>
            {tabs[activeTab].fields.map((field) => {
              const isReactElement = React.isValidElement(field.value);
              const isObject =
                !isReactElement &&
                typeof field.value === 'object' &&
                field.value !== null &&
                !Array.isArray(field.value);
              return (
                <div
                  key={field.label}
                  className={isObject ? 'py-2' : 'flex py-2 min-w-0'}
                >
                  {isObject ? (
                    <HeaderCard
                      title={field.label}
                      fields={Object.entries(
                        field.value as Record<string, any>
                      ).map(([k, v]) => ({ label: k, value: String(v) }))}
                    />
                  ) : (
                    <>
                      <span className='text-muted-foreground text-sm w-1/2 flex-shrink-0'>
                        {field.label}
                      </span>
                      {field.copiable ? (
                        <Copiable
                          value={field.value as string}
                          truncate={field.truncate}
                        />
                      ) : field.badge ? (
                        <Badge
                          variant={
                            typeof field.badge === 'function'
                              ? field.badge(field.value)
                              : 'default'
                          }
                        >
                          {typeof field.value === 'object' &&
                          field.value !== null
                            ? JSON.stringify(field.value)
                            : (field.value as React.ReactNode)}
                        </Badge>
                      ) : (
                        <span
                          className={`font-medium text-foreground ${
                            field.truncate ? 'truncate' : ''
                          }`}
                        >
                          {field.value as React.ReactNode}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : fields ? (
          <div className='space-y-0'>
            {fields.map((field) => {
              const isReactElement = React.isValidElement(field.value);
              const isObject =
                !isReactElement &&
                typeof field.value === 'object' &&
                field.value !== null &&
                !Array.isArray(field.value);
              return (
                <div
                  key={field.label}
                  className={isObject ? 'py-2' : 'flex py-2 min-w-0'}
                >
                  {isObject ? (
                    <HeaderCard
                      title={field.label}
                      fields={Object.entries(
                        field.value as Record<string, any>
                      ).map(([k, v]) => ({ label: k, value: String(v) }))}
                    />
                  ) : (
                    <>
                      <span className='text-muted-foreground text-sm w-1/2 flex-shrink-0'>
                        {field.label}
                      </span>
                      {field.copiable ? (
                        <Copiable
                          value={field.value as string}
                          truncate={field.truncate}
                        />
                      ) : field.badge ? (
                        <Badge
                          variant={
                            typeof field.badge === 'function'
                              ? field.badge(field.value)
                              : 'default'
                          }
                        >
                          {typeof field.value === 'object' &&
                          field.value !== null
                            ? JSON.stringify(field.value)
                            : (field.value as React.ReactNode)}
                        </Badge>
                      ) : (
                        <span
                          className={`font-medium text-foreground ${
                            field.truncate ? 'truncate' : ''
                          }`}
                        >
                          {field.value as React.ReactNode}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : data ? (
          <div className='grid grid-cols-2 gap-x-16 gap-y-6'>
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>
                <p className='text-xs text-muted-foreground mb-1'>{key}</p>
                <p className='text-sm font-semibold text-foreground'>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
