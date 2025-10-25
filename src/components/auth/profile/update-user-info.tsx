import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { authClient } from '@/lib/auth/client';

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof updateUserSchema>;

interface UpdateUserInfoProps {
  initialName?: string;
  initialEmail?: string;
  initialImage?: string | null;
}

export function UpdateUserInfo({
  initialName = '',
  initialEmail = '',
  initialImage = null,
}: UpdateUserInfoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: initialName,
      email: initialEmail,
    },
  });

  const onSubmit = async (data: FormData) => {
    const promises: Promise<void>[] = [];

    if (data.name !== initialName) {
      promises.push(
        authClient
          .updateUser({
            name: data.name,
          })
          .then(() => {
            toast.success('Name updated successfully');
          })
          .catch(() => {
            toast.error('Failed to update name');
          })
      );
    }

    if (data.email !== initialEmail) {
      promises.push(
        authClient
          .changeEmail({
            newEmail: data.email,
            callbackURL: '/profile',
          })
          .then(() => {
            toast.success('Email updated successfully');
          })
          .catch(() => {
            toast.error('Failed to update email');
          })
      );
    }

    if (promises.length > 0) {
      try {
        await Promise.all(promises);
        setDialogOpen(false);
        reset(data); // Reset form with new values
      } catch {
        // Errors are already handled above
      }
    } else {
      toast.info('No changes to save');
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-muted-foreground text-sm">Profile</h3>
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger
            render={(props) => (
              <Button variant="ghost" {...props}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit user
              </Button>
            )}
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information
              </DialogDescription>
            </DialogHeader>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Field name="name">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldControl
                  {...register('name')}
                  disabled={isSubmitting}
                  id="name"
                  placeholder="Enter your name"
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldControl
                  {...register('email')}
                  disabled={isSubmitting}
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>

              <DialogFooter>
                <Button
                  disabled={isSubmitting}
                  onClick={() => setDialogOpen(false)}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isSubmitting || !isDirty} type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 rounded-lg border bg-muted/10 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={initialImage || undefined} />
          <AvatarFallback>
            {initialName?.[0] || initialEmail[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-lg">{initialName || 'No name'}</p>
          <p className="text-muted-foreground text-sm">{initialEmail}</p>
        </div>
      </div>
    </div>
  );
}
