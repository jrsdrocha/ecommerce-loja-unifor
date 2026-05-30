import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { seedProducts } from '@/lib/seed-products';

export async function GET() {
  try {
    await connectDB();

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts);
    }

    const products = await Product.find({ active: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('PRODUCTS_GET_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao buscar produtos.' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
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

    const body = await req.json();

    const required = [
      'name',
      'description',
      'price',
      'stock',
      'course',
      'category',
    ];
    for (const field of required) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ''
      ) {
        return NextResponse.json(
          { message: `Campo obrigatório ausente: ${field}` },
          { status: 400 },
        );
      }
    }

    await connectDB();

    const product = await Product.create({
      name: String(body.name).trim(),
      description: String(body.description).trim(),
      price: Number(body.price),
      stock: Number(body.stock),
      course: String(body.course).trim(),
      category: String(body.category).trim(),
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors: Array.isArray(body.colors) ? body.colors : [],
      image: String(body.image || ''),
      featured: Boolean(body.featured),
      active: body.active !== false,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('PRODUCTS_POST_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao criar produto.' },
      { status: 500 },
    );
  }
}
