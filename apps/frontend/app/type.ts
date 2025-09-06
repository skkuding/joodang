export interface Store {
  id: number;
  name: string;
  phone: string;
  description: string;
  college: string;
  organizer: string;
  ownerId: number;
  instagramId: string;
  startTime: string; // ISO8601 string
  endTime: string; // ISO8601 string
  isAvailable: boolean;
  reservationFee: number;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
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

export interface filterVariables {
  days: string[];
  maxFee: number;
  startTime: string;
  endTime: string;
}

export interface Notification {
  id: number;
  notificationId: number;
  title: string;
  message: string;
  url: string;
  type: "Reservation" | "OwnerApplication" | "Other";
  isRead: boolean;
  createTime: string;
}
