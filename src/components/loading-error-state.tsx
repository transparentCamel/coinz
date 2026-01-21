"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ERROR_MESSAGES } from "@/lib/constants";

interface LoadingErrorStateProps {
  error?: Error;
  isLoading: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

/**
 * Reusable component for handling loading and error states
 * Provides consistent UI for async data fetching states
 */
export function LoadingErrorState({
  error,
  isLoading,
  loadingMessage = "Loading...",
  errorMessage,
  children,
}: LoadingErrorStateProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="border-destructive/50 text-destructive">
        <AlertDescription>
          {error.message || errorMessage || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {loadingMessage}
      </div>
    );
  }

  return <>{children}</>;
}

