import { Link } from '@tanstack/react-router';
import { ArrowLeft, FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardPanel } from '@/components/ui/card';

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardPanel className="pt-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Icon */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="font-semibold text-2xl tracking-tight">
                Page Not Found
              </h1>
              <div className="text-muted-foreground">
                {children || (
                  <p>
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                className="flex items-center gap-2"
                onClick={() => window.history.back()}
                variant="default"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                render={(props) => (
                  <Link className="flex items-center gap-2" to="/" {...props}>
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                )}
                variant="outline"
              />
            </div>

            {/* Help text */}
            <div className="w-full border-t pt-4 text-muted-foreground text-sm">
              Try checking the URL
            </div>
          </div>
        </CardPanel>
      </Card>
    </div>
  );
}
