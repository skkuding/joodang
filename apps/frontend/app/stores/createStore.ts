import { create } from 'zustand'
import { Menu, TimeSlot } from '../type'

interface FormData {
  name: string
  phone: string
  description: string
  organizer: string
  instagramId: string
  startTime: string
  endTime: string
  reservationFee: number
  college: string
  bankCode: string
  accountNumber: string
  accountHolder: string
  location: string
  latitude: number
  longitude: number
  menus: Menu[]
  timeSlots: TimeSlot[]
}

interface CreateStoreStore {
  modalPage: number
  formData: FormData
  setModalPage: (page: number) => void
  setFormData: (data: FormData) => void
  nextModal: () => void
  backModal: () => void
}

export const useCreateStoreStore = create<CreateStoreStore>((set) => ({
  modalPage: 0,
  formData: {
    name: '',
    phone: '',
    description: '',
    organizer: '',
    instagramId: '',
    startTime: '',
    endTime: '',
    reservationFee: 0,
    college: '',
    bankCode: '',
    accountNumber: '',
    accountHolder: '',
    location: '',
    latitude: 0,
    longitude: 0,
    menus: [],
    timeSlots: [],
  },
  setModalPage: (page: number) => set({ modalPage: page }),
  setFormData: (data: FormData) => set({ formData: data }),
  nextModal: () =>
    set((state: { modalPage: number }) => ({
      modalPage: state.modalPage + 1
    })),
  backModal: () =>
    set((state: { modalPage: number }) => ({
      modalPage: state.modalPage - 1
    }))
}))