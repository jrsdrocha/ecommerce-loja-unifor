import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import User from "@/lib/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getCurrentUserFromRequest(req);

    if (!auth) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const course = String(body.course || "").trim();

    if (!name || !phone || !course) {
      return NextResponse.json(
        { message: "Nome, telefone e curso são obrigatórios." },
        { status: 400 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      auth.user._id,
      { name, phone, course },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Dados atualizados com sucesso.",
      user: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);
    return NextResponse.json(
      { message: "Erro ao atualizar os dados." },
      { status: 500 },
    );
  }
}
