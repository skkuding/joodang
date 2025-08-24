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
