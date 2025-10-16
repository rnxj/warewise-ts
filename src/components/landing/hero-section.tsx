import { Link } from '@tanstack/react-router';
import { ArrowRight, Github, Shield, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="mr-1 h-3 w-3" />
            Production-Ready
          </Badge>
          <Badge className="mb-4" variant="secondary">
            <Zap className="mr-1 h-3 w-3" />
            Edge-Optimized
          </Badge>
          <Badge className="mb-4" variant="secondary">
            <Shield className="mr-1 h-3 w-3" />
            Type-Safe
          </Badge>
        </div>

        <h1 className="font-bold text-4xl text-foreground tracking-tight sm:text-6xl lg:text-7xl">
          Modern SaaS
          <span className="block text-primary">Starter Kit</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-8">
          Ship your SaaS faster with pre-configured authentication and database.
          Built on TanStack Start with React 19, TypeScript, and edge-ready
          infrastructure. Everything you need to launch your next project.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/docs">
            <Button className="group" size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Button asChild size="lg" variant="outline">
            <a
              className="inline-flex items-center"
              href="https://github.com/backpine/saas-kit"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* Background gradient */}
      <div className="-top-40 -z-10 sm:-top-80 absolute inset-x-0 transform-gpu overflow-hidden blur-3xl">
        <div
          className="-translate-x-1/2 relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
}
