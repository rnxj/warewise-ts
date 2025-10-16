import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function CoursePromoSection() {
  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
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
        </div>

        <div className="mx-auto mt-12 max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            9 Modules • 11 Hours • 58 Video Lessons
          </Badge>

          <h2 className="mb-4 font-bold text-3xl md:text-4xl">
            Full-Stack SaaS Development on Cloudflare Workers
          </h2>

          <p className="mb-8 text-lg text-muted-foreground">
            Build blazing-fast, globally distributed applications with sub-50ms
            response times. Master the Cloudflare ecosystem through
            project-based learning.
          </p>

          <div className="mb-8 grid gap-6 text-left md:grid-cols-2">
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
                Start Learning Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
