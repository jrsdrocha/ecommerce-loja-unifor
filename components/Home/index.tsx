"use client";

// Componente da página inicial, com filtros de produtos, exibição de produtos em grid e navegação para detalhes do produto

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/Home/ProductFilters";
import { products } from "@/lib/data";

export default function HomeComponent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Todos os Cursos");
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas as Categorias",
  );

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCourse =
      selectedCourse === "Todos os Cursos" ||
      product.course === selectedCourse ||
      product.course === "Todos os Cursos";
    const matchesCategory =
      selectedCategory === "Todas as Categorias" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCourse && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Seção Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Loja Oficial <span className="text-primary">UNIFOR</span>
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground md:text-xl">
                Produtos acadêmicos personalizados para estudantes e
                funcionários da Universidade de Fortaleza.
              </p>
            </div>
          </div>
          {/* Elementos Decorativos */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </section>

        {/* Seção de Produtos */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filtros */}
            <ProductFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Contagens de resultados */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produto
                {filteredProducts.length !== 1 ? "s" : ""} encontrado
                {filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Grid de Produtos */}
            {filteredProducts.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
