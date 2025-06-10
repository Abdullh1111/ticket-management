// /app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const cookie = response.headers.get('set-cookie');
  const resBody = await response.text(); // safer than .json()
  const data = resBody ? JSON.parse(resBody) : null;

  const nextRes = NextResponse.json(data, { status: response.status });

  // Pipe the cookie
  if (cookie) {
    nextRes.headers.set('Set-Cookie', cookie);
  }

  return nextRes;
}
