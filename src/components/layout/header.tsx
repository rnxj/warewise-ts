import { Link } from '@tanstack/react-router';
import { Github, Menu } from 'lucide-react';
import React from 'react';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav className="fixed z-20 w-full px-2">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled &&
              'max-w-5xl rounded-2xl border bg-background/80 backdrop-blur-lg lg:px-5'
          )}
        >
          <div className="flex items-center justify-between gap-6 py-3 lg:py-4">
            {/* Logo - Fixed position, won't shift */}
            <Link
              aria-label="home"
              className="flex flex-shrink-0 items-center space-x-2"
              to="/"
            >
              <img
                alt={siteConfig.name}
                className="h-10 w-10"
                height={40}
                src={siteConfig.logo}
                width={40}
              />
              <span className="font-semibold text-lg">{siteConfig.name}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-3 lg:flex">
              <Button asChild size="sm" variant="ghost">
                <a
                  href={`https://github.com/${siteConfig.social.github}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </Button>
              <ModeToggle />
              <div className="h-4 w-px bg-border" />
              <Button asChild size="sm" variant="outline">
                <Link to="/auth/login">
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth/register">
                  <span>Get Started</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Navigation - Using Popover */}
            <div className="lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button aria-label="Open Menu" size="sm" variant="ghost">
                    <Menu className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-4" sideOffset={8}>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Theme</span>
                      <ModeToggle />
                    </div>
                    <div className="h-px bg-border" />
                    <Button
                      asChild
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      <Link to="/auth/login">
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild className="w-full" size="sm">
                      <Link to="/auth/register">
                        <span>Get Started</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      <a
                        href={`https://github.com/${siteConfig.social.github}`}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
