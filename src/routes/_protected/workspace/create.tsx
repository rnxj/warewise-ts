import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { GalleryVerticalEnd } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUploader } from '@/components/ui/image-uploader';
import { Input } from '@/components/ui/input';
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
  logo: z
    .string()
    .optional()
    .refine((logo) => {
      if (!logo) {
        return true;
      }
      // Check if it's a valid base64 data URL
      if (!logo.startsWith('data:image/')) {
        return false;
      }
      // Check size (roughly 100KB limit for base64)
      const base64 = logo.split(',')[1];
      if (!base64) {
        return false;
      }
      const sizeInBytes = (base64.length * 3) / 4;
      return sizeInBytes <= 100 * 1024; // 100KB
    }, 'Logo must be a valid image under 100KB'),
});

type CreateWorkspaceFormData = z.infer<typeof createWorkspaceSchema>;

function CreateWorkspacePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  });

  const onSubmit = async (data: CreateWorkspaceFormData) => {
    setIsCreating(true);
    try {
      // Generate slug from name automatically
      const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const { data: organization, error } =
        await authClient.organization.create({
          name: data.name,
          slug,
          logo: data.logo || undefined,
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
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Logo</FormLabel>
                      <FormControl>
                        <ImageUploader
                          onChange={field.onChange}
                          size="lg"
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          className="bg-card dark:bg-background"
                          disabled={isCreating}
                          placeholder="eg: My Company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="mt-3 w-full"
                  disabled={isCreating}
                  type="submit"
                >
                  {isCreating ? 'Creating workspace...' : 'Create workspace'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
