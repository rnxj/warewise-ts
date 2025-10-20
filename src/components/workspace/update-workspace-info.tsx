import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Input } from '@/components/ui/input';
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
  logo: z
    .string()
    .optional()
    .refine((logo) => {
      if (!logo) {
        return true;
      }
      if (!logo.startsWith('data:image/')) {
        return false;
      }
      const base64 = logo.split(',')[1];
      if (!base64) {
        return false;
      }
      const sizeInBytes = (base64.length * 3) / 4;
      return sizeInBytes <= 100 * 1024; // 100KB
    }, 'Logo must be a valid image under 100KB'),
});

type UpdateWorkspaceFormData = z.infer<typeof updateWorkspaceSchema>;

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
  const [isUpdating, setIsUpdating] = useState(false);

  const updateForm = useForm<UpdateWorkspaceFormData>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: initialName,
      slug: initialSlug,
      logo: initialLogo || '',
    },
  });

  // Update form values when props change
  React.useEffect(() => {
    updateForm.reset({
      name: initialName,
      slug: initialSlug,
      logo: initialLogo || '',
    });
  }, [initialName, initialSlug, initialLogo, updateForm]);

  const onSubmit = async (data: UpdateWorkspaceFormData) => {
    setIsUpdating(true);
    try {
      const { error } = await authClient.organization.update({
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo || '',
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to update workspace');
        return;
      }

      toast.success('Workspace updated successfully!');
      refetchActiveOrg();
    } catch (_error) {
      toast.error('Failed to update workspace');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...updateForm}>
      <form onSubmit={updateForm.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Workspace Info Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Workspace Details</h3>
              <p className="text-muted-foreground text-sm">
                Basic information about your workspace
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      Workspace Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-9"
                        placeholder="Enter workspace name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Display name for your workspace
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-sm">
                      URL Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-9"
                        placeholder="workspace-url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used in URLs (must be unique)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <FormField
              control={updateForm.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploader
                      onChange={(value) => field.onChange(value || '')}
                      placeholder="Upload logo (max 100KB)"
                      size="sm"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Card */}
          <div className="flex justify-end rounded-lg border bg-muted/30 px-6 py-4">
            <Button
              className="min-w-[120px]"
              disabled={isUpdating}
              type="submit"
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
