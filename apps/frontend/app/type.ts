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

export interface User {
  id: number;
  kakaoId: string;
  name: string;
  phone: string | null;
  studentId: string;
  college: string;
  major: string;
  profileImageUrl: string | null;
  role: "ADMIN" | "OWNER" | "STAFF" | "USER";
}

export interface TimeSlot {
  id: number;
  startTime: string; // ISO8601 string
  endTime: string; // ISO8601 string
  availableSeats: number;
}

export interface ReservationTimeSlot extends TimeSlot {
  totalCapacity: number;
  storeId: number;
}

export interface Menu {
  id: number;
  name: string;
  imageUrl: string | null;
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
