import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormError, FormSuccess } from '@/components/ui/form-messages';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth/client';
import { type RegisterSchema, registerSchema } from '@/lib/schemas/auth';
import PasswordInput from './password-input';

const RegisterForm = () => {
  const [formState, setFormState] = React.useState<{
    success?: string;
    error?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterSchema) => {
    setFormState({});
    const result = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });
    if (result.data) {
      setFormState({ success: 'Registration successful' });
      router.navigate({ to: '/dashboard' });
    } else if (result.error) {
      setFormState({ error: result.error.message || 'An error occurred' });
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormSuccess message={formState.success || ''} />
      <FormError message={formState.error || ''} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          autoComplete="name"
          id="name"
          placeholder="Your name"
          type="text"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          id="email"
          placeholder="you@example.com"
          type="email"
          {...register('email')}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              id="password"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
      </div>
      <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
