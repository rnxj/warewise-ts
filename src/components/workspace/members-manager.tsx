import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CreditCard,
  Crown,
  Package,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authClient } from '@/lib/auth/client';

const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['owner', 'biller', 'inventoryManager']),
});

type InviteFormData = z.infer<typeof inviteMemberSchema>;
type MembersResponse = Awaited<
  ReturnType<typeof authClient.organization.listMembers>
>;
type Member = NonNullable<MembersResponse['data']>['members'][number];

export function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { data: activeOrg } = authClient.useActiveOrganization();
  const orgId = activeOrg?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'inventoryManager',
    },
  });

  const loadMembers = React.useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const { data, error } = await authClient.organization.listMembers();
      if (error) {
        toast.error('Failed to load members');
        return;
      }
      setMembers(data?.members || []);
    } catch (_error) {
      toast.error('Failed to load members');
    } finally {
      setIsLoadingMembers(false);
    }
  }, []);

  // Load data on mount and when active organization changes
  React.useEffect(() => {
    if (!orgId) {
      return;
    }
    loadMembers();
  }, [loadMembers, orgId]);

  const onInviteSubmit = async (data: InviteFormData) => {
    try {
      const { error } = await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
      });

      if (error) {
        toast.error(error.message || 'Failed to send invitation');
        return;
      }

      toast.success('Invitation sent successfully!');
      setIsInviteDialogOpen(false);
      reset(); // Reset form after successful submission
    } catch (_error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleRemoveMember = async (memberIdOrEmail: string) => {
    try {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail,
      });

      if (error) {
        toast.error(error.message || 'Failed to remove member');
        return;
      }

      toast.success('Member removed successfully!');
      loadMembers();
    } catch (_error) {
      toast.error('Failed to remove member');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'biller':
        return <CreditCard className="h-4 w-4" />;
      case 'inventoryManager':
        return <Package className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'biller':
        return 'Biller';
      case 'inventoryManager':
        return 'Inventory Manager';
      default:
        return 'Inventory Manager'; // Default to inventory manager since we removed member role
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default' as const;
      case 'biller':
        return 'secondary' as const;
      case 'inventoryManager':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const roleItems = [
    { label: 'Select a role', value: null },
    { label: 'Inventory Manager', value: 'inventoryManager' },
    { label: 'Biller', value: 'biller' },
    { label: 'Owner', value: 'owner' },
  ];

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="border-b bg-muted/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold">Team Members</h3>
            </div>
            <p className="mt-1 hidden text-muted-foreground text-sm lg:block">
              Manage your workspace members and their roles
            </p>
          </div>
          <Dialog
            onOpenChange={setIsInviteDialogOpen}
            open={isInviteDialogOpen}
          >
            <DialogTrigger
              render={(props) => (
                <Button className="flex items-center gap-2" {...props}>
                  <Plus className="h-4 w-4" />
                  Invite Member
                </Button>
              )}
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Invite Member
                </DialogTitle>
                <DialogDescription>
                  Invite a new member to your workspace by entering their email
                  address and selecting their role.
                </DialogDescription>
              </DialogHeader>
              <Form
                className="space-y-4"
                onSubmit={handleSubmit(onInviteSubmit)}
              >
                <Field name="email">
                  <FieldLabel>Email address</FieldLabel>
                  <FieldControl
                    {...register('email')}
                    disabled={isSubmitting}
                    placeholder="Enter email address"
                    type="email"
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>

                <Field name="role">
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    {...register('role')}
                    disabled={isSubmitting}
                    items={roleItems}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {roleItems.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  <FieldError>{errors.role?.message}</FieldError>
                </Field>

                <DialogFooter>
                  <Button
                    onClick={() => setIsInviteDialogOpen(false)}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? 'Inviting...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {isLoadingMembers ? (
        <div className="flex h-32 items-center justify-center">
          <Loader />
        </div>
      ) : members.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No members found in this workspace.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11">Name</TableHead>
              <TableHead className="h-11">Email</TableHead>
              <TableHead className="h-11">Role</TableHead>
              <TableHead className="h-11">Joined</TableHead>
              <TableHead className="h-11 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member: Member) => (
              <TableRow key={member.id}>
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        alt={member.user.name || ''}
                        src={member.user.image || ''}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.user.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {member.user.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    className="flex w-fit items-center gap-1"
                    variant={getRoleBadgeVariant(member.role)}
                  >
                    {getRoleIcon(member.role)}
                    {getRoleLabel(member.role)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                  {format(new Date(member.createdAt), 'PPP')}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {member.role !== 'owner' && (
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={(props) => (
                          <Button variant="ghost" {...props}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.user.name}{' '}
                            from this workspace? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() =>
                              handleRemoveMember(member.user.email)
                            }
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
