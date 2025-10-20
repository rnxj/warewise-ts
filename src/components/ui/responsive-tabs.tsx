import type * as React from 'react';
import { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <ScrollArea>
          <TabsList className="relative mb-3 h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            {items.map((item) => (
              <TabsTrigger
                className="overflow-hidden rounded-b-none border-x border-t bg-muted py-2 data-[state=active]:z-1 data-[state=active]:bg-background data-[state=active]:shadow-none"
                key={item.value}
                value={item.value}
              >
                {item.icon && (
                  <span
                    aria-hidden="true"
                    className="-ms-0.5 me-1.5 opacity-60"
                  >
                    {item.icon}
                  </span>
                )}
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Mobile Select */}
      <div className="md:hidden">
        <Select onValueChange={handleValueChange} value={currentValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a tab">
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
          <SelectContent>
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
          </SelectContent>
        </Select>
      </div>

      {children}
    </Tabs>
  );
}

export { ResponsiveTabs };
export { TabsContent } from '@/components/ui/tabs';
export type { ResponsiveTabItem };
