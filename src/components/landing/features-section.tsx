import {
  Code,
  Database,
  Layers,
  Palette,
  Route,
  Server,
  Shield,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    icon: Route,
    title: 'TanStack Router',
    description:
      'Type-safe, file-based routing with powerful features like nested layouts, loaders, and search params validation.',
    badge: 'Type-Safe',
  },
  {
    icon: Database,
    title: 'TanStack Query',
    description:
      'Powerful data synchronization with server state management, caching, and background updates built-in.',
    badge: 'Server State',
  },
  {
    icon: Code,
    title: 'React 19',
    description:
      'Latest React with concurrent features, improved performance, and modern development patterns.',
    badge: 'Latest',
  },
  {
    icon: Zap,
    title: 'Vite',
    description:
      'Lightning-fast build tool with hot module replacement and optimized production builds.',
    badge: 'Fast',
  },
  {
    icon: Shield,
    title: 'TypeScript',
    description:
      'Full TypeScript support with strict typing, IntelliSense, and compile-time error checking.',
    badge: 'Type-Safe',
  },
  {
    icon: Palette,
    title: 'Tailwind CSS v4',
    description:
      'Modern utility-first CSS framework with CSS variables and a comprehensive design system.',
    badge: 'Styling',
  },
  {
    icon: Server,
    title: 'SSR Ready',
    description:
      'Server-side rendering support with seamless hydration and SEO optimization out of the box.',
    badge: 'Performance',
  },
  {
    icon: Layers,
    title: 'Shadcn/UI',
    description:
      'Beautiful, accessible component library with customizable themes and modern design patterns.',
    badge: 'Components',
  },
];

const templateFeatures = [
  {
    image: '/cloudflare.png',
    title: 'Edge Database',
    description:
      'Serverless PostgreSQL with Cloudflare D1 or Hyperdrive. Edge-optimized with connection pooling and HTTP proxy to prevent connection overwhelm.',
    badge: 'Database',
    highlight: true,
  },
  {
    image: '/better-auth.png',
    title: 'Better Auth',
    description:
      'Complete authentication solution with social providers, email/password, and session management. Database-agnostic and edge-compatible.',
    badge: 'Authentication',
    highlight: true,
  },
  {
    image: '/pnpm.webp',
    title: 'Monorepo Architecture',
    description:
      'Organized workspace structure with pnpm. Shared components, utilities, and configurations across multiple applications.',
    badge: 'Architecture',
    highlight: true,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Template Features Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            Production-Ready SaaS Template
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pre-configured with authentication and database - ready to deploy
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {templateFeatures.map((feature) => {
            return (
              <Card
                className="group hover:-translate-y-1 border-primary/20 transition-all duration-300 hover:shadow-xl"
                key={feature.title}
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background p-2">
                      <img
                        alt={feature.title}
                        className="h-full w-full object-contain"
                        height={48}
                        src={feature.image}
                        width={48}
                      />
                    </div>
                    <Badge className="text-xs" variant="default">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Core Technologies Section */}
        <div className="mx-auto mt-24 max-w-2xl text-center">
          <h3 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            Built with Modern Technologies
          </h3>
          <p className="mt-4 text-lg text-muted-foreground">
            A carefully curated stack of the best tools and libraries for React
            development
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                className="group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                key={feature.title}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <Badge className="text-xs" variant="outline">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
