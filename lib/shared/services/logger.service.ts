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

    if (this.isDevelopment) {
      this.logToConsole(entry);
    } else {
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

 
  private logToMonitoringService(entry: LogEntry): void {

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

export const logger = new LoggerService();
