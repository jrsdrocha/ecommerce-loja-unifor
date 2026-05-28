import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/db';

import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

import { getCurrentUserFromRequest } from '@/lib/auth';

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

    const { items, customer, deliveryMethod, paymentMethod, address } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Carrinho vazio.' }, { status: 400 });
    }

    await connectDB();

    let subtotal = 0;

    const normalizedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product.id);

      if (!product) {
        return NextResponse.json(
          {
            message: `Produto não encontrado: ${item.product.name}`,
          },
          { status: 404 },
        );
      }

      const quantity = Number(item.quantity);

      const unitPrice = Number(product.price);

      const totalPrice = unitPrice * quantity;

      subtotal += totalPrice;

      normalizedItems.push({
        product: product._id,
        variant: null,

        productName: product.name,

        quantity,

        size: item.size,
        color: item.color,

        personalization: item.personalization || '',

        unitPrice,
        totalPrice,
      });
    }

    const shipping = deliveryMethod === 'delivery' ? 15 : 0;

    const total = subtotal + shipping;

    const order = await Order.create({
      user: auth.user._id,

      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf || '',
        course: customer.course || '',
      },

      items: normalizedItems,

      deliveryMethod,
      paymentMethod,

      address: deliveryMethod === 'delivery' ? address : null,

      subtotal,
      shipping,
      total,

      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Pedido realizado com sucesso.',
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('CREATE_ORDER_ERROR', error);

    return NextResponse.json(
      { message: 'Erro ao criar pedido.' },
      { status: 500 },
    );
  }
}

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

    const orders = await Order.find({
      user: auth.user._id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error('GET_ORDERS_ERROR', error);

    return NextResponse.json(
      { message: 'Erro ao buscar pedidos.' },
      { status: 500 },
    );
  }
}
