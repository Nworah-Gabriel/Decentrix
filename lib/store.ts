import { create } from "zustand"

interface Attestation {
  uid: string
  schemaId: string
  schemaType: string
  from: string
  to: string
  type: string
  timestamp: string
}

interface AttestationStore {
  totalAttestations: number
  totalSchemas: number
  uniqueAttestors: number
  attestations: Attestation[]
  fetchStats: () => void
  fetchAttestations: () => void
}

export const useAttestationStore = create<AttestationStore>((set) => ({
  totalAttestations: 0,
  totalSchemas: 0,
  uniqueAttestors: 0,
  attestations: [],

  fetchStats: () => {
    // Simulate API call - replace with actual Sui blockchain data
    setTimeout(() => {
      set({
        totalAttestations: 12847,
        totalSchemas: 324,
        uniqueAttestors: 1256,
      })
    }, 500)
  },

  fetchAttestations: () => {
    // Simulate API call - replace with actual Sui blockchain data
    setTimeout(() => {
      const mockAttestations: Attestation[] = [
        {
          uid: "0x1a2b3c4d5e6f7890abcdef1234567890",
          schemaId: "179",
          schemaType: "WITNESSED_ATTESTATIONS",
          from: "attestations.suibreakerlabs.sui",
          to: "attestations.suibreakerlabs.sui",
          type: "ONCHAIN",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          uid: "0x2b3c4d5e6f7890abcdef1234567890ab",
          schemaId: "179",
          schemaType: "WITNESSED_ATTESTATIONS",
          from: "attestations.suibreakerlabs.sui",
          to: "attestations.suibreakerlabs.sui",
          type: "ONCHAIN",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          uid: "0x3c4d5e6f7890abcdef1234567890abcd",
          schemaId: "153",
          schemaType: "ENDORSEMENTS",
          from: "attestations.suibreakerlabs.sui",
          to: "certez.sui",
          type: "ONCHAIN",
          timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        },
        {
          uid: "0x4d5e6f7890abcdef1234567890abcdef",
          schemaId: "179",
          schemaType: "IDENTITY_VERIFICATION",
          from: "attestations.suibreakerlabs.sui",
          to: "attestations.suibreakerlabs.sui",
          type: "ONCHAIN",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          uid: "0x5e6f7890abcdef1234567890abcdef12",
          schemaId: "179",
          schemaType: "REPUTATION_SCORE",
          from: "attestations.suibreakerlabs.sui",
          to: "attestations.suibreakerlabs.sui",
          type: "ONCHAIN",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ]

      set({ attestations: mockAttestations })
    }, 300)
  },
}))
