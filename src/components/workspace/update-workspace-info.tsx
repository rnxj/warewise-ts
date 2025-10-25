import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { FormImageUploader } from '@/components/ui/form-image-uploader';
import { authClient } from '@/lib/auth/client';

const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(50, 'Workspace name must be less than 50 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  logo: z.string().optional(),
});

type FormData = z.infer<typeof updateWorkspaceSchema>;

interface UpdateWorkspaceInfoProps {
  initialName: string;
  initialSlug: string;
  initialLogo?: string;
}

export function UpdateWorkspaceInfo({
  initialName,
  initialSlug,
  initialLogo,
}: UpdateWorkspaceInfoProps) {
  const { refetch: refetchActiveOrg } = authClient.useActiveOrganization();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialName,
      slug: initialSlug,
      logo: initialLogo || '',
    },
  });

  const onSubmit = async (data: FormData, event?: React.BaseSyntheticEvent) => {
    try {
      // Get logo value from the form's FormData since FormImageUploader isn't controlled
      const formElement = event?.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const logoValue = formData.get('logo') as string;

      const { error } = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          logo: logoValue || '',
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to update workspace');
        return;
      }

      toast.success('Workspace updated successfully!');
      refetchActiveOrg();
    } catch (error) {
      toast.error('Failed to update workspace', {
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Workspace Info Card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Workspace Details</h3>
          <p className="text-muted-foreground text-sm">
            Basic information about your workspace
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name">
            <FieldLabel className="font-medium text-sm">
              Workspace Name
            </FieldLabel>
            <FieldControl
              {...register('name')}
              disabled={isSubmitting}
              placeholder="Enter workspace name"
            />
            <FieldDescription>Display name for your workspace</FieldDescription>
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          <Field name="slug">
            <FieldLabel className="font-medium text-sm">URL Slug</FieldLabel>
            <FieldControl
              {...register('slug')}
              disabled={isSubmitting}
              placeholder="workspace-url"
            />
            <FieldDescription>Used in URLs (must be unique)</FieldDescription>
            <FieldError>{errors.slug?.message}</FieldError>
          </Field>
        </div>
      </div>

      {/* Logo Card */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Workspace Logo</h3>
          <p className="text-muted-foreground text-sm">
            Upload a logo to personalize your workspace
          </p>
        </div>

        <FormImageUploader
          defaultValue={initialLogo || ''}
          disabled={isSubmitting}
          name="logo"
          placeholder="Upload logo (max 100KB)"
          size="lg"
        />
      </div>

      {/* Action Card */}
      <div className="flex justify-end rounded-lg border bg-muted/30 px-6 py-4">
        <Button className="min-w-[120px]" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Updating...' : 'Save Changes'}
        </Button>
      </div>
    </Form>
  );
}
