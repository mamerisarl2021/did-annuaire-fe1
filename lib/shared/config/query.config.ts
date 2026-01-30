/**
 * React Query Configuration Constants
 * Centralizes timing and retry logic for consistent behavior across the app
 */

export const QUERY_CONFIG = {
  /**
   * Standard stale time for relatively stable data (e.g., user profile, organizations list)
   * Default: 5 minutes
   */
  STALE_TIME_STANDARD: 5 * 60 * 1000,

  /**
   * Fast stale time for dynamic data (e.g., real-time status, active requests)
   * Default: 1 minute
   */
  STALE_TIME_FAST: 1 * 60 * 1000,

  /**
   * Extremely fast stale time for highly volatile data
   * Default: 30 seconds
   */
  STALE_TIME_VOLATILE: 30 * 1000,

  /**
   * Time until unused data is removed from cache
   * Default: 10 minutes
   */
  GC_TIME_STANDARD: 10 * 60 * 1000,

  /**
   * Number of retries on query failure
   * Default: 1
   */
  RETRY_COUNT_STANDARD: 1,

  /**
   * No retries for specific operations
   */
  RETRY_COUNT_NONE: 0,

  /**
   * Infinite time for data that never or very rarely changes
   */
  STALE_TIME_INFINITE: Infinity,
  GC_TIME_INFINITE: Infinity,
} as const;
