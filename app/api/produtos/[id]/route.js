import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getCurrentUserFromRequest } from '@/lib/auth';

export async function GET(_req, { params }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado.' },
        { status: 404 },
      );
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('PRODUCT_GET_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao buscar produto.' },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
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
    await connectDB();

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body.description !== undefined
          ? { description: String(body.description).trim() }
          : {}),
        ...(body.price !== undefined ? { price: Number(body.price) } : {}),
        ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
        ...(body.course !== undefined
          ? { course: String(body.course).trim() }
          : {}),
        ...(body.category !== undefined
          ? { category: String(body.category).trim() }
          : {}),
        ...(body.sizes !== undefined
          ? { sizes: Array.isArray(body.sizes) ? body.sizes : [] }
          : {}),
        ...(body.colors !== undefined
          ? { colors: Array.isArray(body.colors) ? body.colors : [] }
          : {}),
        ...(body.image !== undefined ? { image: String(body.image) } : {}),
        ...(body.featured !== undefined
          ? { featured: Boolean(body.featured) }
          : {}),
        ...(body.active !== undefined ? { active: Boolean(body.active) } : {}),
      },
      { new: true },
    );

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('PRODUCT_PATCH_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar produto.' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
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
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Produto removido.' });
  } catch (error) {
    console.error('PRODUCT_DELETE_ERROR', error);
    return NextResponse.json(
      { message: 'Erro ao remover produto.' },
      { status: 500 },
    );
  }
}
