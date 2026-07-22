import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ProblemDetail } from '../../shared/models/problem-detail';

/** Normalized error shape components can consume without knowing about HTTP or RFC 7807. */
export interface ApiError {
  status: number;
  message: string;
}

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Catches HttpErrorResponse, turns RFC 7807 problem+json bodies (or a plain HTTP status)
 * into a friendly, typed ApiError, and rethrows it so callers only ever deal with ApiError.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      const problem = err.error as ProblemDetail | null;
      const message =
        err.status === 409
          ? 'This email is already in use.'
          : (problem?.detail ?? problem?.title ?? DEFAULT_MESSAGE);

      const apiError: ApiError = { status: err.status, message };
      return throwError(() => apiError);
    }),
  );
