import { Loader2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth/client';

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
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const handleUpdateName = async () => {
    if (name === initialName) {
      toast.info('Name is the same as before');
      return;
    }

    setIsUpdatingName(true);
    try {
      await authClient.updateUser({
        name,
      });
      toast.success('Name updated successfully');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to update name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangeEmail = async () => {
    if (email === initialEmail) {
      toast.info('Email is the same as before');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      await authClient.changeEmail({
        newEmail: email,
        callbackURL: '/profile',
      });
      toast.success('Email updated successfully');
      setDialogOpen(false);
    } catch {
      toast.error('Failed to update email');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleSave = async () => {
    const promises: Promise<void>[] = [];

    if (name !== initialName) {
      promises.push(handleUpdateName());
    }

    if (email !== initialEmail) {
      promises.push(handleChangeEmail());
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    } else {
      setDialogOpen(false);
    }
  };

  const isUpdating = isUpdatingName || isUpdatingEmail;
  const hasChanges = name !== initialName || email !== initialEmail;

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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isUpdating}
                onClick={() => setDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isUpdating || !hasChanges} onClick={handleSave}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
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
