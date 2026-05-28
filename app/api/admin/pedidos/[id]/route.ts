import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';

import Order from '@/lib/models/Order';

import { getCurrentUserFromRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const auth = await getCurrentUserFromRequest(req);

    if (!auth) {
      return NextResponse.json(
        {
          message: 'Não autenticado.',
        },
        { status: 401 },
      );
    }

    if (auth.payload.role !== 'admin') {
      return NextResponse.json(
        {
          message: 'Acesso negado.',
        },
        { status: 403 },
      );
    }

    const body = await req.json();

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        ...(body.status && {
          status: body.status,
        }),
      },
      {
        new: true,
      },
    );

    if (!order) {
      return NextResponse.json(
        {
          message: 'Pedido não encontrado.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      order,
    });
  } catch (error) {
    console.error('ADMIN_ORDER_PATCH_ERROR', error);

    return NextResponse.json(
      {
        message: 'Erro ao atualizar pedido.',
      },
      { status: 500 },
    );
  }
}
