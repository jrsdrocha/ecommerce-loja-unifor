import type { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
export const AUTH_COOKIE_NAME = 'auth_token';

export type AuthRole = 'user' | 'admin';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: AuthRole;
};

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
}

export function getTokenFromRequest(req: NextRequest) {
  return req.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getCurrentUserFromRequest(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.sub);
  if (!user) return null;

  return {
    payload,
    user,
  };
}

function normalizeAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function roleFromEmail(email: string): AuthRole {
  const admins = normalizeAdminEmails();
  return admins.includes(email.toLowerCase()) ? 'admin' : 'user';
}
