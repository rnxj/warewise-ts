import { useNavigate } from '@tanstack/react-router';
import { Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/components/ui/menu';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  iconOnly?: boolean;
  redirectTo?: string;
  onSignOut?: () => void;
  children?: React.ReactNode;
  asChild?: 'dropdown';
}

export function SignOutButton({
  variant = 'outline',
  size = 'default',
  className,
  showIcon = true,
  iconOnly = false,
  redirectTo = '/auth/login',
  onSignOut,
  children,
  asChild,
}: SignOutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async (e?: Event) => {
    if (e) {
      e.preventDefault();
    }

    setIsSigningOut(true);
    try {
      await authClient.signOut();

      // Call custom handler if provided
      if (onSignOut) {
        onSignOut();
      }

      // Navigate to the specified route
      if (redirectTo.startsWith('/')) {
        navigate({ to: redirectTo });
      } else {
        window.location.href = redirectTo;
      }
    } catch {
      toast.error('Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const content = isSigningOut ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Signing out...
    </>
  ) : (
    <>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || 'Sign Out'}
    </>
  );

  // Render as dropdown item
  if (asChild === 'dropdown') {
    return (
      <MenuItem
        className={cn(
          'cursor-pointer',
          variant === 'destructive' &&
            'text-destructive focus:text-destructive',
          className
        )}
        disabled={isSigningOut}
        onClick={() => handleSignOut()}
      >
        {content}
      </MenuItem>
    );
  }

  // Render as icon-only button
  if (iconOnly) {
    return (
      <Button
        className={cn('text-destructive hover:text-destructive', className)}
        disabled={isSigningOut}
        onClick={() => handleSignOut()}
        size="icon"
        variant={variant}
      >
        {isSigningOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Render as regular button
  return (
    <Button
      className={className}
      disabled={isSigningOut}
      onClick={() => handleSignOut()}
      size={size}
      variant={variant}
    >
      {content}
    </Button>
  );
}
