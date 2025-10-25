import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Group, GroupItem } from '@/components/ui/group';
import { authClient } from '@/lib/auth/client';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const [isVisible, setIsVisible] = useState(false);
  const id = useId();
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || 'Login failed');
        return;
      }

      toast.success('Login successful');
      router.navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('Login failed', {
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
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
        <FieldLabel htmlFor={id}>Password</FieldLabel>
        <Group className="w-full">
          <GroupItem
            className="flex-1"
            render={
              <FieldControl
                {...register('password')}
                autoComplete="current-password"
                disabled={isSubmitting}
                id={id}
                placeholder="Password"
                type={isVisible ? 'text' : 'password'}
              />
            }
          />
          <GroupItem
            render={
              <Button
                aria-label={isVisible ? 'Hide password' : 'Show password'}
                aria-pressed={isVisible}
                disabled={isSubmitting}
                onClick={toggleVisibility}
                size="icon"
                type="button"
                variant="outline"
              />
            }
          >
            {isVisible ? (
              <EyeOffIcon aria-hidden="true" size={16} />
            ) : (
              <EyeIcon aria-hidden="true" size={16} />
            )}
          </GroupItem>
        </Group>
        <FieldError>{errors.password?.message}</FieldError>
      </Field>

      <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </Form>
  );
};

export default LoginForm;
