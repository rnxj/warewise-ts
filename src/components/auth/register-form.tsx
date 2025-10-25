import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/client';
import { type RegisterSchema, registerSchema } from '@/lib/schemas/auth';
import PasswordInput from './password-input';

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        toast.error(result.error.message || 'Registration failed');
        return;
      }

      toast.success('Registration successful');
      router.navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('Registration failed', {
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field name="name">
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <FieldControl
          {...register('name')}
          autoComplete="name"
          disabled={isSubmitting}
          id="name"
          placeholder="Your name"
          type="text"
        />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field name="email">
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldControl
          {...register('email')}
          autoComplete="email"
          disabled={isSubmitting}
          id="email"
          placeholder="you@example.com"
          type="email"
        />
        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <Field name="password">
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              disabled={isSubmitting}
              id="password"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <FieldError>{errors.password?.message}</FieldError>
      </Field>

      <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </Form>
  );
};

export default RegisterForm;
