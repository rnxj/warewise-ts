import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  Calculator,
  Package,
  Receipt,
  Smartphone,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { HeroHeader } from '@/components/layout/header';
import { NotFound } from '@/components/not-found';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardPanel } from '@/components/ui/card';
import { TextEffect } from '@/components/ui/text-effect';
import { siteConfig } from '@/config/site';

export const Route = createFileRoute('/')({
  component: HomeComponent,
  notFoundComponent: () => <NotFound />,
  head: () => ({
    meta: [
      {
        title: siteConfig.name,
      },
    ],
  }),
});

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

function HomeComponent() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden contain-strict lg:block"
        >
          <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-140 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="-rotate-45 absolute top-0 left-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="-translate-y-87.5 -rotate-45 absolute top-0 left-0 h-320 w-60 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            <div className="-z-10 absolute inset-0 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
                <AnimatedGroup variants={transitionVariants}>
                  <a
                    className="group mx-auto flex w-fit items-center gap-4 rounded-full border bg-muted p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 hover:bg-background dark:border-t-white/5 dark:shadow-zinc-950 dark:hover:border-t-border"
                    href="mailto:reuelnixon@gmail.com?subject=Warewise Inquiry&body=Hi, I'd like to learn more about Warewise for my business."
                  >
                    <span className="text-foreground text-sm">
                      Trusted by Growing Indian Businesses
                    </span>
                    <span className="block h-4 w-0.5 border-l bg-white dark:border-background dark:bg-zinc-700" />

                    <div className="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-muted">
                      <div className="-translate-x-1/2 flex w-12 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                </AnimatedGroup>

                <TextEffect
                  as="h1"
                  className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                >
                  Smart Business Management Made Simple
                </TextEffect>
                <TextEffect
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-lg"
                  delay={0.5}
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                >
                  All-in-one business management for Indian businesses.
                  Inventory, billing, POS, and accounting with GST compliance.
                </TextEffect>

                <AnimatedGroup
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: transitionVariants.item,
                  }}
                >
                  <div
                    className="rounded-[calc(var(--radius-xl)+0.125rem)] border bg-foreground/10 p-0.5"
                    key={1}
                  >
                    <Button
                      className="rounded-xl px-5 text-base"
                      render={(props) => (
                        <a
                          href="mailto:reuelnixon@gmail.com?subject=Free Demo Request - Warewise&body=Hi, I'm interested in a free demo of Warewise for my business."
                          {...props}
                        >
                          <span className="text-nowrap">Book Free Demo</span>
                        </a>
                      )}
                      size="lg"
                    />
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              className="mt-24"
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 1,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
            >
              <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                  <TextEffect
                    as="h2"
                    className="text-balance text-4xl md:text-5xl"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                  >
                    Everything Your Business Needs
                  </TextEffect>
                  <TextEffect
                    as="p"
                    className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
                    delay={0.3}
                    preset="fade-in-blur"
                    speedSegment={0.3}
                  >
                    Essential business tools for Indian businesses
                  </TextEffect>
                </div>

                <div className="mx-auto grid gap-6 *:text-center md:grid-cols-2 lg:grid-cols-4">
                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Package className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Inventory Management</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Track stock levels, manage products, set reorder points,
                        and get real-time inventory insights across all
                        locations.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Users className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Vendor Management</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Manage supplier relationships, track purchase orders,
                        and maintain comprehensive vendor records with payment
                        history.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Receipt className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">GST Billing</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Generate GST-compliant invoices, manage tax
                        calculations, and ensure seamless compliance with Indian
                        tax regulations.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Store className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Point of Sale</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Modern POS system for quick sales processing, barcode
                        scanning, and seamless integration with inventory
                        management.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Users className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Customer Management</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Build lasting customer relationships with detailed
                        profiles, purchase history, and personalized
                        communication tools.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Calculator className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Accounting</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Complete financial management with automated
                        bookkeeping, expense tracking, and comprehensive
                        financial reporting.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <TrendingUp className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Business Analytics</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Gain insights with detailed reports, sales analytics,
                        and performance metrics to make data-driven decisions.
                      </p>
                    </CardPanel>
                  </Card>

                  <Card className="group shadow-zinc-950/5">
                    <CardHeader className="pb-3">
                      <CardDecorator>
                        <Smartphone className="size-6" />
                      </CardDecorator>
                      <h3 className="mt-6 font-medium">Mobile Ready</h3>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm">
                        Access your business data anywhere with our
                        mobile-responsive design and progressive web app
                        capabilities.
                      </p>
                    </CardPanel>
                  </Card>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        <section className="bg-background pt-16 pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <TextEffect
                as="h2"
                className="text-balance text-4xl md:text-5xl"
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Ready to Transform Your Business?
              </TextEffect>
              <TextEffect
                as="p"
                className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground"
                delay={0.3}
                preset="fade-in-blur"
                speedSegment={0.3}
              >
                Join smart businesses using Warewise. Customizable solutions
                that scale with you.
              </TextEffect>
              <AnimatedGroup
                className="mt-10"
                variants={{
                  container: {
                    visible: {
                      transition: {
                        delayChildren: 0.5,
                      },
                    },
                  },
                  item: transitionVariants.item,
                }}
              >
                <Button
                  className="rounded-xl px-8"
                  render={(props) => (
                    <a
                      href="mailto:reuelnixon@gmail.com?subject=Free Demo Request - Warewise&body=Hi, I'm interested in a free demo of Warewise for my business."
                      {...props}
                    >
                      Book Free Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  size="lg"
                />
              </AnimatedGroup>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 transition-colors duration-300 ease-in-out [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] dark:group-hover:bg-white/10 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)25%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)25%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent to-75% to-card"
    />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-background">
      {children}
    </div>
  </div>
);
