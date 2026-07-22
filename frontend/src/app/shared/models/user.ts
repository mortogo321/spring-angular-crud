/** A user record as returned by the backend API. */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/** Request body for creating or updating a user. */
export type UserPayload = Pick<User, 'firstName' | 'lastName' | 'email'>;
