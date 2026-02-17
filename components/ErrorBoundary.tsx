"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Standard ErrorBoundary to catch unexpected React crashes.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Oups ! Quelque chose s&apos;est mal passé
          </h1>
          <p className="mb-8 max-w-md text-gray-600">
            Une erreur inattendue est survenue dans l&apos;application. Nous avons été informés du
            problème.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={this.handleReset} variant="default" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Actualiser la page
            </Button>
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              Retour à l&apos;accueil
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="mt-12 max-w-2xl px-4">
              <div className="rounded-lg bg-red-50 p-4 text-left font-mono text-xs text-red-800">
                <p className="font-bold underline mb-2">Debug Info (Dev Only):</p>
                {this.state.error.toString()}
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
