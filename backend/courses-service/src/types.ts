export interface AuthPayload {
  sub: string;
  email: string;
  role?: string;
  [k: string]: any;
}

export interface Course {
  course_id: string;
  title: string;
  description?: string;
  category?: string;
  instructor?: string;
  duration?: string;
}
