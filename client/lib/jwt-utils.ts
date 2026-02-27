// JWT token decoding utility using jwt-decode library
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'

export interface DecodedToken {
  sub: string; // user ID
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function decodeJwtToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    toast.error('Authentication token is invalid. Please log in again.');
    return null;
  }
}

export function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error('No authentication token found. Please log in.');
      return null;
    }

    const decoded = decodeJwtToken(token);
    return decoded?.sub || null;
  } catch (error) {
    toast.error('Failed to authenticate user. Please log in again.');
    return null;
  }
}