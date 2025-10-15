export interface AuthPayload {
  sub: string;
  email: string;
  role?: string;
  [k: string]: any;
}

export interface Recommendation {
  title: string;
  description: string;
  duration?: string;
  url?: string;
}
