"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiException } from "@/lib/shared/api/api.errors";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
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
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-foreground">
                        Oups ! Quelque chose s'est mal passé.
                    </h1>
                    <p className="mb-8 max-w-md text-muted-foreground">
                        Une erreur inattendue a interrompu l'application. Nos ingénieurs ont été prévenus.
                    </p>

                    <div className="flex gap-4">
                        <Button onClick={this.handleReset} variant="default">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Rafraîchir la page
                        </Button>
                        <Button
                            onClick={() => window.location.href = "/"}
                            variant="outline"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>

                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <div className="mt-8 w-full max-w-2xl overflow-auto rounded-md bg-muted p-4 text-left">
                            <p className="mb-2 font-mono text-xs font-bold text-destructive">
                                {this.state.error.name}: {this.state.error.message}
                            </p>
                            <pre className="font-mono text-[10px] opacity-70">
                                {this.state.error.stack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
