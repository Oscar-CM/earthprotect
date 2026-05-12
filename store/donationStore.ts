import { create } from 'zustand'
import type { DonationTier, DonationFrequency } from '@/types'

interface DonationState {
  selectedTier: DonationTier | null
  customAmount: number | null
  frequency: DonationFrequency
  donorName: string
  donorEmail: string

  setTier: (tier: DonationTier) => void
  setCustomAmount: (amount: number | null) => void
  setFrequency: (frequency: DonationFrequency) => void
  setDonorInfo: (name: string, email: string) => void
  reset: () => void
  effectiveAmount: () => number | null
}

const initialState = {
  selectedTier: null,
  customAmount: null,
  frequency: 'monthly' as DonationFrequency,
  donorName: '',
  donorEmail: '',
}

export const useDonationStore = create<DonationState>()((set, get) => ({
  ...initialState,

  setTier: (tier) => set({ selectedTier: tier, customAmount: null }),
  setCustomAmount: (amount) => set({ customAmount: amount, selectedTier: null }),
  setFrequency: (frequency) => set({ frequency }),
  setDonorInfo: (donorName, donorEmail) => set({ donorName, donorEmail }),
  reset: () => set(initialState),

  effectiveAmount: () => {
    const { selectedTier, customAmount } = get()
    return selectedTier?.amount ?? customAmount
  },
}))
