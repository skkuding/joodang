export interface Store {
  id: number;
  name: string;
  phone: string;
  description: string;
  organizer: string;
  instagramId: string;
  startTime: string; // ISO8601 string
  endTime: string; // ISO8601 string
  isAvailable: boolean;
  reservationFee: number;
  college: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface StoreDetail extends Store {
  menus: Menu[];
  timeSlots: TimeSlot[];
  currentAvailableSeats: number | null;
}

export interface TimeSlot {
  id: number;
  startTime: string; // ISO8601 string
  endTime: string; // ISO8601 string
  availableSeats: number;
}

export interface Menu {
  id: number;
  name: string;
  photoUrl: string | null;
  price: number;
  category: string;
  storeId: number;
}

export interface MenuData {
  Bap: Menu[];
}

export interface AccountData {
  bank: string;
  accountNum: string;
  owner: string;
}
