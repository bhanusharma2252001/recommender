import axios from 'axios';
import { AuthPayload } from '../types';
const AUTH_VERIFY_URL = process.env.AUTH_URL || 'http://auth-service:3001/auth/verify';
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const res = await axios.post(AUTH_VERIFY_URL, { token }, { timeout: 3000 });
    if (res.data && res.data.valid) return res.data.payload as AuthPayload;
    return null;
  } catch (e) {
    return null;
  }
}
