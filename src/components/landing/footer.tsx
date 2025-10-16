import { ExternalLink } from 'lucide-react';
import { FaGithub, FaXTwitter } from 'react-icons/fa6';

const navigation = {
  main: [
    { name: 'TanStack Start', href: 'https://tanstack.com/start' },
    { name: 'TanStack Router', href: 'https://tanstack.com/router' },
    { name: 'TanStack Query', href: 'https://tanstack.com/query' },
    { name: 'React', href: 'https://react.dev' },
  ],
  tools: [
    { name: 'Vite', href: 'https://vitejs.dev' },
    { name: 'Shadcn/UI', href: 'https://ui.shadcn.com' },
    { name: 'pnpm Workspaces', href: 'https://pnpm.io/workspaces' },
    { name: 'Drizzle ORM', href: 'https://orm.drizzle.team' },
  ],
  social: [
    {
      name: 'GitHub',
      href: 'https://github.com/backpine/saas-kit',
      icon: FaGithub,
    },
    {
      name: 'X',
      href: 'https://x.com/backpinelabs',
      icon: FaXTwitter,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col space-y-6 md:flex-row md:items-center md:space-x-8 md:space-y-0">
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              TanStack Ecosystem
            </h3>
            <ul className="mt-2 space-y-1">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <a
                    className="group inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.name}
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground text-sm">
              Development Tools
            </h3>
            <ul className="mt-2 space-y-1">
              {navigation.tools.map((item) => (
                <li key={item.name}>
                  <a
                    className="group inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.name}
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col space-y-4 md:mt-0 md:flex-row md:items-center md:space-x-6 md:space-y-0">
          <div className="flex space-x-6">
            {navigation.social.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href={item.href}
                  key={item.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="sr-only">{item.name}</span>
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-xs">
              Built with TanStack Start
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              &copy; {new Date().getFullYear()} Backpine SaaS Kit. MIT Licensed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
