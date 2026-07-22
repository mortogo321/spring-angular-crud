/** RFC 7807 `application/problem+json` error body returned by the backend. */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  /** Present on 400 validation failures: field name -> message. */
  errors?: Record<string, string>;
}
