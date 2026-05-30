import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { setAuthCookie, signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-mail e senha são obrigatórios.' },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { message: 'Credenciais inválidas.' },
        { status: 401 },
      );
    }

    const token = signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      message: 'Login realizado com sucesso.',
      user: user.toJSON(),
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('LOGIN_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao autenticar.' },
      { status: 500 },
    );
  }
}
