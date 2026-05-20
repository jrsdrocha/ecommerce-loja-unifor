import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const result = await getCurrentUserFromRequest(req);

    if (!result) {
      return NextResponse.json(
        { message: 'Não autenticado.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      user: result.user.toJSON(),
      role: result.payload.role,
    });
  } catch (error) {
    console.error('ME_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao verificar sessão.' },
      { status: 500 },
    );
  }
}
