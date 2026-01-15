type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class LoggerService {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  /**
   * Log general information
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  /**
   * Log warnings
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  /**
   * Log errors with optional error object
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : undefined;
    this.log("error", message, { ...context, errorDetails: error }, errorObj);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      this.logToConsole(entry);
    } else {
      // In production, send to monitoring service
      this.logToMonitoringService(entry);
    }
  }

  /**
   * Log to console (development)
   */
  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case "debug":
        console.debug(prefix, entry.message, entry.context);
        break;
      case "info":
        console.info(prefix, entry.message, entry.context);
        break;
      case "warn":
        console.warn(prefix, entry.message, entry.context);
        break;
      case "error":
        console.error(prefix, entry.message, entry.context, entry.error);
        break;
    }
  }

  /**
   * Send logs to monitoring service (production)
   * This is a placeholder for integration with services like:
   * - Sentry
   * - DataDog
   * - CloudWatch
   * - LogRocket
   * - New Relic
   */
  private logToMonitoringService(entry: LogEntry): void {
    // TODO: Integrate with your monitoring service of choice
    // For now, still log to console but in a structured format
    // that can be picked up by log aggregation tools

    // Example: If using Sentry
    // if (entry.level === 'error' && entry.error) {
    //   Sentry.captureException(entry.error, {
    //     contexts: { custom: entry.context },
    //     level: 'error',
    //   });
    // }

    // Fallback to console in structured format
    console[entry.level](
      JSON.stringify({
        ...entry,
        error: entry.error
          ? {
              message: entry.error.message,
              stack: entry.error.stack,
              name: entry.error.name,
            }
          : undefined,
      })
    );
  }
}

// Export singleton instance
export const logger = new LoggerService();
