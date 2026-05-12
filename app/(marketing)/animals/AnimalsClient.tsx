'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimalCard } from '@/components/cards/AnimalCard'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Animal, AfricanRegion, ConservationStatus } from '@/types'

const REGIONS: AfricanRegion[] = [
  'East Africa',
  'West Africa',
  'Central Africa',
  'North Africa',
  'Southern Africa',
]

const STATUSES: ConservationStatus[] = [
  'Critically Endangered',
  'Endangered',
  'Vulnerable',
  'Near Threatened',
  'Least Concern',
]

interface AnimalsClientProps {
  animals: Animal[]
}

export function AnimalsClient({ animals }: AnimalsClientProps) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [sort, setSort] = useState<string>('name')

  const filtered = useMemo(() => {
    let list = animals

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.species.toLowerCase().includes(q) ||
          a.countries.some((c) => c.toLowerCase().includes(q))
      )
    }

    if (region !== 'all') {
      list = list.filter((a) => a.region === region)
    }

    if (status !== 'all') {
      list = list.filter((a) => a.conservationStatus === status)
    }

    const statusOrder: Record<string, number> = {
      'Extinct': 0,
      'Extinct in the Wild': 1,
      'Critically Endangered': 2,
      'Endangered': 3,
      'Vulnerable': 4,
      'Near Threatened': 5,
      'Least Concern': 6,
    }

    if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'status') {
      list = [...list].sort(
        (a, b) =>
          (statusOrder[a.conservationStatus] ?? 9) -
          (statusOrder[b.conservationStatus] ?? 9)
      )
    } else if (sort === 'population') {
      list = [...list].sort(
        (a, b) =>
          (a.population.current ?? Infinity) - (b.population.current ?? Infinity)
      )
    }

    return list
  }, [animals, search, region, status, sort])

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--ep-bg)' }}>
      {/* Header */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionTitle
            accent="African Wildlife"
            title="Animals of Africa"
            subtitle="Discover Africa's extraordinary wildlife — from the towering elephant to the elusive pangolin. Learn about each species, its conservation status, and how you can help."
            centered
          />
        </div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-[72px] z-30 px-6 py-4"
        style={{
          background: 'color-mix(in srgb, var(--ep-bg) 90%, transparent)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--ep-border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--ep-muted)' }}
            />
            <Input
              placeholder="Search animals, species, countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
              style={{ background: 'var(--ep-card)', borderColor: 'var(--ep-border)' }}
            />
          </div>

          <Select value={region} onValueChange={(v) => setRegion(v ?? 'all')}>
            <SelectTrigger className="w-44 text-sm" style={{ borderColor: 'var(--ep-border)' }}>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v ?? 'all')}>
            <SelectTrigger className="w-52 text-sm" style={{ borderColor: 'var(--ep-border)' }}>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v ?? 'name')}>
            <SelectTrigger className="w-40 text-sm" style={{ borderColor: 'var(--ep-border)' }}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="status">Sort: Threat Level</SelectItem>
              <SelectItem value="population">Sort: Population</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1.5 ml-auto text-sm" style={{ color: 'var(--ep-muted)' }}>
            <SlidersHorizontal size={14} />
            <span>{filtered.length} species</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🦁</p>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
              No animals found
            </p>
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((animal) => (
              <AnimalCard key={animal.slug} animal={animal} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
