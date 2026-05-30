"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  role: string;
};

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  course: string;
};

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormState>({
    name: "",
    email: "",
    phone: "",
    course: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.user) {
          setUser(null);
          return;
        }

        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          course: data.user.course || "",
        });
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Nome é obrigatório.";
    }
    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório.";
    }
    if (!formData.course) {
      newErrors.course = "Curso é obrigatório.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("/api/auth/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course: formData.course,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Falha ao salvar alterações.");
        return;
      }

      setUser(data.user);
      setIsEditing(false);
      setMessage("Dados atualizados com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      course: user.course || "",
    });
    setErrors({});
    setMessage("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16 bg-background" />}>
        <Header />
      </Suspense>

      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Perfil do usuário</CardTitle>
              <CardDescription>
                Confira seus dados e atualize quando precisar.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="rounded-lg border border-border bg-secondary/50 p-6 text-center text-sm text-muted-foreground">
                  Carregando informações do perfil...
                </div>
              ) : !user ? (
                <div className="rounded-lg border border-border bg-secondary/50 p-6 text-center text-sm text-muted-foreground">
                  Você precisa estar logado para acessar esta página.
                  <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/login">
                      <Button>Entrar</Button>
                    </Link>
                    <Link href="/cadastro">
                      <Button variant="outline">Criar conta</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {message ? (
                    <div className="rounded-md border border-border bg-secondary px-4 py-3 text-sm text-foreground">
                      {message}
                    </div>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                      {errors.name ? (
                        <p className="text-sm text-destructive">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                      {errors.phone ? (
                        <p className="text-sm text-destructive">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Curso</Label>
                      <Input
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                      {errors.course ? (
                        <p className="text-sm text-destructive">
                          {errors.course}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/80 p-4">
                    <p className="text-sm text-muted-foreground">
                      Tipo de conta{" "}
                      <span className="font-medium text-foreground">
                        {user.role}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Última atualização em{" "}
                      <span className="text-foreground">
                        {new Date().toLocaleDateString("pt-BR")}
                      </span>
                    </p>
                  </div>

                  <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                    {isEditing ? (
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button type="submit">Salvar mudanças</Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Alterar dados
                      </Button>
                    )}
                  </CardFooter>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
