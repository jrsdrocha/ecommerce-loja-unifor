import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUserFromRequest(req);

    if (!auth) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
      },
    });
  } catch (error) {
    console.error('AUTH_ME_ERROR', error);

    return NextResponse.json(
      {
        message: 'Erro ao carregar usuário.',
      },
      { status: 500 },
    );
  }
}
