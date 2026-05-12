export type ConservationStatus =
  | 'Extinct'
  | 'Extinct in the Wild'
  | 'Critically Endangered'
  | 'Endangered'
  | 'Vulnerable'
  | 'Near Threatened'
  | 'Least Concern'

export type AfricanRegion =
  | 'East Africa'
  | 'West Africa'
  | 'Central Africa'
  | 'North Africa'
  | 'Southern Africa'

export type DonationFrequency = 'one-time' | 'monthly' | 'annual'

export type MembershipRole = 'community' | 'volunteer' | 'ambassador'

export type ThreatLevel = 'Critical' | 'High' | 'Moderate' | 'Low'

export interface AnimalFact {
  label: string
  value: string
}

export interface AdoptionTier {
  id: string
  animalSlug: string
  label: string
  amount: number
  interval: 'month' | 'year'
  description: string
  perks: string[]
  stripePriceId?: string
}

export interface AnimalThreat {
  title: string
  description: string
}

export interface EcoFact {
  emoji: string
  label: string
  detail: string
}

export interface Animal {
  slug: string
  name: string
  species: string
  commonName: string
  region: AfricanRegion
  countries: string[]
  conservationStatus: ConservationStatus
  population: {
    current: number | null
    trend: 'Increasing' | 'Decreasing' | 'Stable' | 'Unknown'
    year: number
  }
  habitat: string[]
  description: string
  extendedDescription?: string
  imageUrl: string
  thumbnailUrl: string
  facts: AnimalFact[]
  threats?: AnimalThreat[]
  ecoFacts?: EcoFact[]
  adoptionTiers: AdoptionTier[]
  fundingGoal: number
  fundingRaised: number
}

export interface Country {
  name: string
  code: string
  flag: string
  habitat: string[]
  featuredAnimals: string[]
}

export interface Region {
  id: string
  name: AfricanRegion
  description: string
  countries: Country[]
  imageUrl: string
  keyHabitats: string[]
  threatLevel: ThreatLevel
}

export interface DonationTier {
  id: string
  label: string
  amount: number
  frequency: DonationFrequency
  description: string
  perks: string[]
  stripePriceId?: string
  featured?: boolean
}

export interface ShopItem {
  id: string
  slug: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: 'apparel' | 'prints' | 'accessories' | 'digital'
  tags: string[]
  stripeProductId?: string
  stripePriceId?: string
  inStock: boolean
  proceedsNote: string
}

export interface CartItem {
  item: ShopItem
  quantity: number
}

export interface MembershipTier {
  id: MembershipRole
  label: string
  description: string
  commitment: string
  perks: string[]
  applicationRequired: boolean
}

export interface JoinFormData {
  firstName: string
  lastName: string
  email: string
  country: string
  role: MembershipRole
  motivation: string
  newsletter: boolean
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  tags: string[]
  imageUrl: string
  category: 'news' | 'story' | 'research' | 'update'
}

export interface DbBlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  tags: string[]
  imageUrl: string
  category: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NewsArticle {
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { name: string }
}

export interface NavLink {
  label: string
  href: string
}

export interface ImpactStat {
  value: string
  label: string
  icon: string
}
