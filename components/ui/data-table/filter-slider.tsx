import { Slider } from '../slider';
import { Button } from '../button';
import { Input } from '../input';
import { SelectInput } from '../select-input';

interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface FilterSliderProps {
  open: boolean;
  filterFields?: FilterField[];
  tempFilters: Record<string, any>;
  getTodayDate: () => string;
  onClose: () => void;
  onTempFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
  onApply: () => void;
}

export function FilterSlider({
  open,
  filterFields,
  tempFilters,
  getTodayDate,
  onClose,
  onTempFilterChange,
  onReset,
  onApply,
}: FilterSliderProps) {
  if (!filterFields) return null;

  return (
    <Slider open={open} onClose={onClose} title='Filter By' width='md'>
      <div className='space-y-4'>
        {filterFields.map((field) => (
          <div key={field.name}>
            <label className='block text-sm font-medium mb-2'>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <SelectInput
                value={tempFilters[field.name] || ''}
                onChange={(val: string) =>
                  onTempFilterChange({ ...tempFilters, [field.name]: val })
                }
                options={
                  field.options?.map((opt) => ({
                    label: opt.label,
                    value: String(opt.value),
                  })) || []
                }
                placeholder={field.placeholder || 'Select...'}
              />
            ) : field.type === 'date' ? (
              <Input
                type='date'
                value={tempFilters[field.name] || getTodayDate()}
                onChange={(e) =>
                  onTempFilterChange({
                    ...tempFilters,
                    [field.name]: e.target.value,
                  })
                }
              />
            ) : field.type === 'daterange' ? (
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  type='date'
                  value={tempFilters[`${field.name}_start`] || getTodayDate()}
                  onChange={(e) =>
                    onTempFilterChange({
                      ...tempFilters,
                      [`${field.name}_start`]: e.target.value,
                    })
                  }
                  placeholder='Start date'
                />
                <Input
                  type='date'
                  value={tempFilters[`${field.name}_end`] || getTodayDate()}
                  onChange={(e) =>
                    onTempFilterChange({
                      ...tempFilters,
                      [`${field.name}_end`]: e.target.value,
                    })
                  }
                  placeholder='End date'
                />
              </div>
            ) : (
              <Input
                type='text'
                value={tempFilters[field.name] || ''}
                onChange={(e) =>
                  onTempFilterChange({
                    ...tempFilters,
                    [field.name]: e.target.value,
                  })
                }
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
        <div className='flex gap-4 pt-4'>
          <Button variant='secondary' onClick={onReset} className='flex-1'>
            Reset
          </Button>
          <Button variant='theme' onClick={onApply} className='flex-1'>
            Apply Filter
          </Button>
        </div>
      </div>
    </Slider>
  );
}
