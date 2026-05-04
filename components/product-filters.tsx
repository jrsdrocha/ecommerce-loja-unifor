'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { courses, categories } from '@/lib/data'

interface ProductFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCourse: string
  setSelectedCourse: (course: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedCategory,
  setSelectedCategory,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-sm border border-border md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-secondary border-0"
        />
      </div>

      {/* Course Filter */}
      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
        <SelectTrigger className="w-full md:w-[200px] bg-secondary border-0">
          <SelectValue placeholder="Curso" />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course} value={course}>
              {course}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full md:w-[200px] bg-secondary border-0">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
