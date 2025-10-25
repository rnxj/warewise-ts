import { createFileRoute, useRouter } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { FormImageUploader } from '@/components/ui/form-image-uploader';
import { siteConfig } from '@/config/site';
import { authClient } from '@/lib/auth/client';

export const Route = createFileRoute('/_protected/workspace/create')({
  component: CreateWorkspacePage,
});

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(50, 'Workspace name must be less than 50 characters'),
  logo: z.string().optional(),
});

type Errors = Record<string, string | string[]>;

function submitForm(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);

  const result = createWorkspaceSchema.safeParse(data);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return { errors: fieldErrors as Errors };
  }

  return {
    errors: {} as Errors,
    data: { ...result.data, logo: (data.logo as string) || '' },
  };
}

function CreateWorkspacePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const handleClearErrors = (next: Errors) => setErrors(next);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsCreating(true);
    const response = await submitForm(event);

    if (Object.keys(response.errors).length > 0) {
      setErrors(response.errors);
      setIsCreating(false);
      return;
    }

    const data = response.data;
    try {
      // Generate slug from name automatically
      const slug = data?.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const { data: organization, error } =
        await authClient.organization.create({
          name: data?.name || '',
          slug: slug || '',
          logo: data?.logo || undefined,
        });

      if (error) {
        toast.error(error.message || 'Failed to create workspace');
        return;
      }

      // Set the new organization as active
      if (organization) {
        await authClient.organization.setActive({
          organizationId: organization.id,
        });
      }

      toast.success('Workspace created successfully!');
      router.navigate({ to: '/dashboard' });
    } catch (error) {
      toast.error('Failed to create workspace', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <a className="flex items-center gap-2 self-center font-medium" href="/">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {siteConfig.name}
        </a>

        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              Create your workspace
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              <p>Set up your workspace to get started</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Form
              className="space-y-4"
              errors={errors}
              onClearErrors={handleClearErrors}
              onSubmit={onSubmit}
            >
              <FormImageUploader
                disabled={isCreating}
                name="logo"
                placeholder="Upload logo (max 100KB)"
                size="lg"
              />

              <Field name="name">
                <FieldLabel>Workspace name</FieldLabel>
                <FieldControl
                  autoFocus
                  className="bg-card dark:bg-background"
                  disabled={isCreating}
                  placeholder="eg: My Company"
                />
                <FieldError />
              </Field>

              <Button
                className="mt-3 w-full"
                disabled={isCreating}
                type="submit"
              >
                {isCreating ? 'Creating workspace...' : 'Create workspace'}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
