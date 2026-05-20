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

    await connectDB();

    if (auth.payload.role === 'admin') {
      const orders = await Order.find()
        .populate('user', 'name email course role')
        .sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }

    const orders = await Order.find({ user: auth.user._id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('ORDERS_GET_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao buscar pedidos.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getCurrentUserFromRequest(req);
    if (!auth) {
      return NextResponse.json(
        { message: 'Não autenticado.' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { message: 'O pedido precisa ter pelo menos um item.' },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.create({
      user: auth.user._id,
      customer: {
        name: body.customer?.name || auth.user.name,
        email: body.customer?.email || auth.user.email,
        phone: body.customer?.phone || auth.user.phone,
        cpf: body.customer?.cpf || '',
        course: body.customer?.course || auth.user.course,
      },
      items,
      deliveryMethod: body.deliveryMethod || 'campus',
      paymentMethod: body.paymentMethod || 'pix',
      shippingAddress: body.shippingAddress || {},
      subtotal: Number(body.subtotal || 0),
      shipping: Number(body.shipping || 0),
      total: Number(body.total || 0),
      status: 'pending',
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('ORDERS_POST_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao criar pedido.' },
      { status: 500 },
    );
  }
}
