import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getCurrentUserFromRequest(req);

    if (!auth) {
      return NextResponse.json(
        { message: 'Não autenticado.' },
        { status: 401 },
      );
    }

    const orderId = params.id;

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: 'Pedido não encontrado.' }, { status: 404 });
    }

    if (order.user.toString() !== auth.user._id.toString()) {
      return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
    }

    if (order.status === 'delivered') {
      return NextResponse.json({ message: 'Pedido já entregue.' }, { status: 400 });
    }

    order.status = 'delivered';
    await order.save();

    return NextResponse.json({ message: 'Pedido marcado como entregue.', order });
  } catch (error) {
    console.error('UPDATE_ORDER_ERROR', error);
    return NextResponse.json({ message: 'Erro ao atualizar pedido.' }, { status: 500 });
  }
}
