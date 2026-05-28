import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';

import Order from '@/lib/models/Order';

import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await getCurrentUserFromRequest(req);

    if (!auth) {
      return NextResponse.json(
        { message: 'Não autenticado.' },
        { status: 401 },
      );
    }

    if (auth.payload.role !== 'admin') {
      return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
    }

    await connectDB();

    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error('ADMIN_ORDERS_GET_ERROR', error);

    return NextResponse.json(
      {
        message: 'Erro ao buscar pedidos.',
      },
      { status: 500 },
    );
  }
}
