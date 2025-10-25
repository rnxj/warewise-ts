import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  ChevronDown,
  Home,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardPanel, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });
  const [showDetails, setShowDetails] = useState(false);

  // Format error details for display
  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorStack = error?.stack || '';
  const hasStack = errorStack.length > 0;

  const handleReportError = () => {
    const subject = encodeURIComponent('Error Report');
    const body = encodeURIComponent(
      `An error occurred in the application:\n\nError: ${errorMessage}\n\nStack Trace:\n${errorStack}\n\nPlease describe what you were doing when this error occurred:`
    );
    window.location.href = `mailto:hi@rnxj.dev?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <p className="text-muted-foreground text-sm">
                We encountered an unexpected error. Please try again.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardPanel className="space-y-6">
          {/* Error Alert */}
          <Alert variant="error">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex items-center gap-2"
              onClick={() => router.invalidate()}
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            {isRoot ? (
              <Button
                render={(props) => (
                  <Link className="flex items-center gap-2" to="/" {...props}>
                    <Home className="h-4 w-4" />
                    Go to Home
                  </Link>
                )}
                variant="outline"
              />
            ) : (
              <Button
                className="flex items-center gap-2"
                onClick={() => window.history.back()}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
          </div>

          {/* Error Details (Collapsible) */}
          {hasStack && (
            <Collapsible onOpenChange={setShowDetails} open={showDetails}>
              <CollapsibleTrigger
                render={(props) => (
                  <Button
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    variant="ghost"
                    {...props}
                  >
                    <Bug className="h-4 w-4" />
                    Technical Details
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
                    />
                  </Button>
                )}
              />
              <CollapsiblePanel className="space-y-2">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-medium text-sm">
                    Error Stack Trace:
                  </h4>
                  <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-muted-foreground text-xs">
                    {errorStack}
                  </pre>
                </div>
              </CollapsiblePanel>
            </Collapsible>
          )}

          {/* Help Section */}
          <div className="border-t pt-4">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="text-muted-foreground text-sm">
                If this error persists, please report it to our support team.
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={handleReportError}
                variant="outline"
              >
                <Mail className="h-4 w-4" />
                Report Error
              </Button>
            </div>
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
