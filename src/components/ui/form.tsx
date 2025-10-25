import { Form as FormPrimitive } from '@base-ui-components/react/form';
import type * as React from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type UseControllerReturn,
  useController,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function Form({ className, ...props }: FormPrimitive.Props) {
  return (
    <FormPrimitive
      className={cn('flex w-full flex-col gap-4', className)}
      data-slot="form"
      {...props}
    />
  );
}

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control?: Control<TFieldValues>;
  render: (field: UseControllerReturn<TFieldValues, TName>) => React.ReactNode;
}

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, control, render }: FormFieldProps<TFieldValues, TName>) {
  const field = useController({ name, control });
  return <>{render(field)}</>;
}

function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        'font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}

function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('font-medium text-destructive text-sm', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
