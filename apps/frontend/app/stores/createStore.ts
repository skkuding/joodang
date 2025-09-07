import { create } from "zustand";

export interface FormData {
  name: string;
  description: string;
  organizer: string;
  startTime?: string;
  endTime?: string;
  reservationFee: number;
  college: string;
  icon: number;
  totalCapacity: number;
  contactInfo: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  location: string;
  latitude: number;
  longitude: number;
  timeSlots: {
    id: string;
    startTime: Date;
    endTime: Date;
  }[];
  representativeImage: File | null;
  representativeImagePreview: string | null;
  menuItems: {
    id: string;
    name: string;
    price: number;
    category: string;
    image: File | null;
    imagePreview: string | null;
  }[];
}

interface CreateStoreStore {
  modalPage: number;
  formData: FormData;
  setModalPage: (page: number) => void;
  setFormData: (data: FormData) => void;
  nextModal: () => void;
  backModal: () => void;
}

export const useCreateStoreStore = create<CreateStoreStore>(set => ({
  modalPage: 0,
  formData: {
    name: "",
    description: "",
    organizer: "",
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    reservationFee: 0,
    college: "",
    icon: 1,
    totalCapacity: 0,
    contactInfo: "",
    bankCode: "",
    accountNumber: "",
    accountHolder: "",
    location: "",
    latitude: 0,
    longitude: 0,
    menus: [],
    timeSlots: [],
    representativeImage: null,
    representativeImagePreview: null,
    menuItems: [],
  },
  setModalPage: (page: number) => set({ modalPage: page }),
  setFormData: (data: FormData) => set({ formData: data }),
  nextModal: () =>
    set((state: { modalPage: number }) => ({
      modalPage: state.modalPage + 1,
    })),
  backModal: () =>
    set((state: { modalPage: number }) => ({
      modalPage: state.modalPage - 1,
    })),
}));
