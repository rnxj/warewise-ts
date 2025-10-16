import { Link } from '@tanstack/react-router';
import { ExternalLink, Github, LogIn, Menu } from 'lucide-react';
import * as React from 'react';
import { AccountDialog } from '@/components/auth/account-dialog';
import { ThemeToggle } from '@/components/theme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

type NavigationItem = {
  label: string;
  href: string;
  isExternal?: boolean;
  scrollTo?: string;
};

const navigationItems: NavigationItem[] = [
  { label: 'Features', href: '/#features', scrollTo: 'features' },
  {
    label: 'Documentation',
    href: '/docs',
    isExternal: false,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/backpine/saas-kit',
    isExternal: true,
  },
];

export function NavigationBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/app',
    });
  };

  const user = session?.user;
  const fallbackText = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || 'U';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (_item: NavigationItem) => {
    setIsOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'border-border/50 border-b bg-background/80 shadow-lg shadow-primary/5 backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo and Brand */}
          <Link
            className="group flex items-center space-x-3 no-underline"
            to="/"
          >
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text font-bold text-lg text-transparent transition-all duration-300 group-hover:from-primary group-hover:to-primary/80 lg:text-xl">
                SaaS Starter Kit
              </span>
              <span className="font-medium text-muted-foreground text-xs tracking-wider">
                on CLOUDFLARE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 lg:flex">
            {navigationItems.map((item) => (
              <div className="group relative" key={item.label}>
                {item.isExternal ? (
                  <a
                    className="group flex items-center space-x-2 rounded-lg px-4 py-2 font-medium text-muted-foreground text-sm transition-all duration-300 hover:bg-accent/50 hover:text-foreground"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span>{item.label}</span>
                    {item.label === 'GitHub' ? (
                      <Github className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </a>
                ) : (
                  <Link
                    className="block rounded-lg px-4 py-2 font-medium text-muted-foreground text-sm transition-all duration-300 hover:bg-accent/50 hover:text-foreground"
                    onClick={() => handleNavClick(item)}
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                )}
                <div className="-translate-x-1/2 absolute bottom-0 left-1/2 h-0.5 w-0 transform bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 group-hover:w-3/4" />
              </div>
            ))}

            {/* Theme Toggle */}
            <div className="ml-2 border-border/30 border-l pl-2">
              <ThemeToggle align="end" variant="ghost" />
            </div>
          </div>

          {/* Auth Button - Desktop */}
          <div className="hidden lg:block">
            {session ? (
              <AccountDialog>
                <Button
                  className="flex items-center gap-2 px-3"
                  variant="ghost"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      alt={user?.name || 'User'}
                      src={user?.image || undefined}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {fallbackText}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {user?.name || 'Account'}
                  </span>
                </Button>
              </AccountDialog>
            ) : (
              <Button
                className="gap-2"
                onClick={handleGoogleSignIn}
                variant="default"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle align="end" variant="ghost" />
            <Sheet onOpenChange={setIsOpen} open={isOpen}>
              <SheetTrigger asChild>
                <Button
                  className="relative h-10 w-10 hover:bg-accent/50"
                  size="icon"
                  variant="ghost"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-[300px] border-border/50 border-l bg-background/95 backdrop-blur-xl"
                side="right"
              >
                <SheetHeader className="space-y-1 pb-6 text-left">
                  <SheetTitle className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-bold text-transparent text-xl">
                    Navigation
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Explore TanStack Start
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-2 pb-6">
                  {navigationItems.map((item) => (
                    <div className="group relative" key={item.label}>
                      {item.isExternal ? (
                        <a
                          className="flex w-full items-center justify-between rounded-lg px-4 py-3 font-medium text-muted-foreground text-sm transition-all duration-300 hover:bg-accent/50 hover:text-foreground"
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <span>{item.label}</span>
                          {item.label === 'GitHub' ? (
                            <Github className="h-4 w-4" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </a>
                      ) : (
                        <Link
                          className="flex w-full items-center rounded-lg px-4 py-3 text-left font-medium text-muted-foreground text-sm transition-all duration-300 hover:bg-accent/50 hover:text-foreground"
                          onClick={() => handleNavClick(item)}
                          to={item.href}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="border-border/50 border-t pt-4">
                  {session ? (
                    <div className="flex items-center gap-3 rounded-lg bg-accent/30 px-4 py-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          alt={user?.name || 'User'}
                          src={user?.image || undefined}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {fallbackText}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={handleGoogleSignIn}
                      variant="default"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign In with Google
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
