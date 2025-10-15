export interface AdminPayload {
  sub: string;
  email: string;
  role?: string;
  [k: string]: any;
}
