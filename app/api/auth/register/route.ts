import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { roleFromEmail, setAuthCookie, signAuthToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const phone = String(body.phone || '').trim();
    const course = String(body.course || '').trim();
    const password = String(body.password || '');

    if (!name || !email || !phone || !course || !password) {
      return NextResponse.json(
        { message: 'Preencha todos os campos obrigatórios.' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'A senha precisa ter pelo menos 8 caracteres.' },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'Já existe um usuário cadastrado com esse e-mail.' },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = roleFromEmail(email);

    const user = await User.create({
      name,
      email,
      phone,
      course,
      password: hashedPassword,
      role,
    });

    const token = signAuthToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'Cadastro realizado com sucesso.',
        user: user.toJSON(),
      },
      { status: 201 },
    );

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error('REGISTER_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao criar conta.' },
      { status: 500 },
    );
  }
}
