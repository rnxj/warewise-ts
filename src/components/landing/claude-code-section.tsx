import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ClaudeCodeSection() {
  return (
    <section
      className="bg-gradient-to-b from-background to-muted/20 sm:py-6"
      id="claude-code"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4" variant="outline">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered Setup
          </Badge>
          <h2 className="font-bold text-3xl text-foreground tracking-tight sm:text-4xl">
            Setup Powered by Claude Code
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let Claude Code agents help you set up this project
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="mb-8">
            <img
              alt="Claude Code CLI"
              className="mx-auto w-full max-w-3xl rounded-lg shadow-lg"
              height={300}
              src="/claude-code-cli.webp"
              width={300}
            />
          </div>

          <div className="mx-auto max-w-2xl rounded-lg border bg-muted/30 p-6">
            <p className="mb-4 text-muted-foreground">
              Just say this to Claude Code:
            </p>
            <div className="rounded-lg border bg-background p-4 font-mono text-sm">
              <span className="text-primary">Help me setup this project</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
