import { NextRequest, NextResponse } from 'next/server';

import { clearAuthCookie } from '@/lib/auth';

export async function POST(_req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logout realizado.',
    });

    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error('LOGOUT_ERROR', error);

    return NextResponse.json({ message: 'Erro ao sair.' }, { status: 500 });
  }
}
