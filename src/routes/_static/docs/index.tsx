import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircle,
  DatabaseIcon,
  ShieldCheckIcon,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/_static/docs/')({
  component: RouteComponent,
});

const gettingStartedSteps = [
  {
    name: 'database',
    title: 'Database Setup',
    description:
      'Configure your serverless database with edge optimization and HTTP proxying to prevent connection overwhelm in isolated environments.',
    icon: DatabaseIcon,
    image: '/cloudflare.png',
    badgeVariant: 'default' as const,
    features: [
      'Edge Optimized',
      'Connection Pooling',
      'HTTP Proxy',
      'Serverless Ready',
    ],
  },
  {
    name: 'authentication',
    title: 'Authentication Setup',
    description:
      'Set up comprehensive authentication with Better Auth, including social providers, email/password, and session management for serverless environments.',
    icon: ShieldCheckIcon,
    image: '/better-auth.png',
    badgeVariant: 'secondary' as const,
    features: [
      'Social OAuth',
      'Session Management',
      'Database Agnostic',
      'Edge Compatible',
    ],
  },
];

function RouteComponent() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="mb-4 flex justify-center">
          <BookOpenIcon className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-4 font-bold text-4xl tracking-tight">
          Documentation
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground text-xl">
          Comprehensive guides for your mono repo SaaS kit built with TanStack
          Start, covering authentication, database setup, and payment
          integration.
        </p>
        <Badge className="text-sm" variant="secondary">
          Mono Repo Architecture
        </Badge>
      </div>

      {/* Tech Stack Banner */}
      <div className="mb-12">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div>
                <h3 className="mb-2 font-semibold text-lg">
                  Built with Modern Technologies
                </h3>
                <p className="text-muted-foreground">
                  TanStack Start, React 19, TypeScript, Tailwind CSS v4, and
                  Shadcn/UI
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <img
                  alt="TanStack"
                  className="h-8 w-8 rounded"
                  height={32}
                  src="/tanstack.png"
                  width={32}
                />
                <img
                  alt="Shadcn/UI"
                  className="h-8 w-8 rounded"
                  height={32}
                  src="/shadcn.png"
                  width={32}
                />
                <img
                  alt="React"
                  className="h-8 w-8 rounded"
                  height={32}
                  src="/logo192.png"
                  width={32}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claude Code Setup Section */}
      <div className="mb-12">
        <Card className="border bg-gradient-to-b from-background to-muted/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Badge className="mb-4" variant="outline">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered Setup
              </Badge>
              <h3 className="mb-4 font-semibold text-2xl">
                Quick Setup with Claude Code
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                Skip the manual setup and let Claude Code agents configure your
                entire project automatically.
              </p>
              <div className="mb-6">
                <img
                  alt="Claude Code CLI"
                  className="mx-auto w-full max-w-2xl rounded-lg shadow-lg"
                  height={100}
                  src="/claude-code-cli.webp"
                  width={100}
                />
              </div>
              <div className="mx-auto max-w-lg rounded-lg border bg-muted/30 p-6">
                <p className="mb-4 text-muted-foreground">
                  Just say this to Claude Code:
                </p>
                <div className="rounded-lg border bg-background p-4 font-mono text-sm">
                  <span className="text-primary">
                    Help me setup this project
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <div className="mb-12">
        <div className="mb-8 text-center">
          <h2 className="mb-4 font-bold text-3xl tracking-tight">
            Getting Started Guide
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Follow these steps in order to set up your SaaS application. Each
            step builds on the previous one.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gettingStartedSteps.map((step) => {
            const IconComponent = step.icon;

            return (
              <Card
                className="group h-full transition-all duration-200 hover:shadow-lg"
                key={step.name}
              >
                <CardHeader className="pb-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                  <div className="mb-4 flex justify-center">
                    <img
                      alt={step.title}
                      className="h-16 w-16 rounded-lg border bg-background object-contain p-2"
                      height={64}
                      src={step.image}
                      width={64}
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="mb-4 leading-relaxed">
                    {step.description}
                  </CardDescription>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {step.features.map((feature) => (
                      <Badge
                        className="text-xs"
                        key={feature}
                        variant="secondary"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Link
                    className="block"
                    params={{ name: step.name }}
                    to="/docs/$name"
                  >
                    <Button className="w-full transition-colors group-hover:bg-primary/90">
                      Start {step.title}
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access Section */}
      <Card className="border-dashed bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            Quick Access
          </CardTitle>
          <CardDescription>
            Jump directly to any documentation section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {gettingStartedSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Link
                  key={step.name}
                  params={{ name: step.name }}
                  to="/docs/$name"
                >
                  <Card className="group cursor-pointer border-muted transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-semibold transition-colors group-hover:text-primary">
                          {step.title}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed transition-colors group-hover:text-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Promo Section */}
      <div className="-mx-4 mt-16 mb-8 bg-gradient-to-b from-background to-muted/20 px-4 py-8">
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            frameBorder="0"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/1-dXh8J08UI?si=aSyQCYk1YVJAlG7X"
            title="YouTube video player"
          />
        </div>

        <div className="mt-8 text-center">
          <Badge className="mb-4" variant="secondary">
            9 Modules • 11 Hours • 58 Video Lessons
          </Badge>

          <h2 className="mb-4 font-bold text-2xl md:text-3xl">
            Master Full-Stack Development on Cloudflare Workers
          </h2>

          <p className="mx-auto mb-6 max-w-3xl text-lg text-muted-foreground">
            Take your skills to the next level with our comprehensive course.
            Build production-ready SaaS applications with sub-50ms response
            times globally.
          </p>

          <div className="mx-auto mb-8 grid max-w-3xl gap-6 text-left md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="mb-2 font-semibold text-lg">What You'll Build</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    SmartLinks - Complete short link service
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Location-based intelligent redirects
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">AI-powered link analysis</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">Real-time analytics dashboard</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="mb-2 font-semibold text-lg">
                Technologies Covered
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Cloudflare D1, KV, R2, Workers AI
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Durable Objects for state management
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">
                    Better Auth & Stripe integration
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm">TypeScript, Drizzle ORM, pnpm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <a
                href="https://learn.backpine.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Enroll in Course
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
