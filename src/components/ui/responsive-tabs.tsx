import type * as React from 'react';
import { useState } from 'react';
// ScrollArea removed to avoid hover-induced scrollbar behavior
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ResponsiveTabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ResponsiveTabsProps {
  items: ResponsiveTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function ResponsiveTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: ResponsiveTabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || items[0]?.value || ''
  );
  const currentValue = value || internalValue;

  const handleValueChange = (newValue: string) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <Tabs
      className={cn('space-y-6', className)}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      value={currentValue}
    >
      {/* Desktop Browser Tabs */}
      <div className="hidden md:block">
        <div className="overflow-x-auto overflow-y-hidden">
          <TabsList
            className="data-[orientation=horizontal]:pb-0.5 data-[orientation=horizontal]:[&_[data-slot=tab-indicator]]:translate-y-0"
            variant="underline"
          >
            {items.map((item) => (
              <TabsTab key={item.value} value={item.value}>
                {item.icon && (
                  <span
                    aria-hidden="true"
                    className="-ms-0.5 me-1.5 opacity-60"
                  >
                    {item.icon}
                  </span>
                )}
                {item.label}
              </TabsTab>
            ))}
          </TabsList>
        </div>
      </div>

      {/* Mobile Select */}
      <div className="md:hidden">
        <Select onValueChange={handleValueChange} value={currentValue}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {(() => {
                const currentItem = items.find(
                  (item) => item.value === currentValue
                );
                if (!currentItem) {
                  return null;
                }
                return (
                  <div className="flex items-center gap-2">
                    {currentItem.icon && (
                      <span aria-hidden="true" className="opacity-60">
                        {currentItem.icon}
                      </span>
                    )}
                    {currentItem.label}
                  </div>
                );
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectPopup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex items-center gap-2">
                  {item.icon && (
                    <span aria-hidden="true" className="opacity-60">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>

      {children}
    </Tabs>
  );
}

export { ResponsiveTabs };
export { TabsPanel } from '@/components/ui/tabs';
export type { ResponsiveTabItem };
