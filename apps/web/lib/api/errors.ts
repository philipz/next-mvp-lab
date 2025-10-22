/**
 * HTTP Error class for structured error handling in API responses.
 *
 * This class extends the built-in Error to provide:
 * - HTTP status code information
 * - Optional error details from the backend response
 * - Proper error name for debugging
 *
 * @example
 * ```typescript
 * // Throwing an error
 * if (!res.ok) {
 *   const error = await res.json().catch(() => ({ message: res.statusText }));
 *   throw new HttpError(res.status, error.message || res.statusText, error);
 * }
 *
 * // Catching and handling errors
 * try {
 *   const data = await apiClient.get('/api/products');
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.log(`HTTP ${error.status}: ${error.message}`);
 *     if (error.details) {
 *       console.log('Details:', error.details);
 *     }
 *   }
 * }
 * ```
 */
export class HttpError extends Error {
  /**
   * HTTP status code from the response
   */
  public readonly status: number;

  /**
   * Optional additional error details from the backend
   * Can include validation errors, error codes, or other contextual information
   */
  public readonly details?: unknown;

  /**
   * Creates a new HttpError instance.
   *
   * @param status - HTTP status code (e.g., 404, 500)
   * @param message - Human-readable error message
   * @param details - Optional additional error details from the backend
   */
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}
