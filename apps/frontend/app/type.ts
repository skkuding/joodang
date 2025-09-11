import { MenuCategory } from "@/lib/utils/store-utils";

export interface Store {
  id: number;
  name: string;
  description: string;
  college: string;
  organizer: string;
  imageUrl: string;
  ownerId: number;
  icon: number;
  totalCapacity: number;
  contactInfo: string;
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
  festivalId: number | null;
}

export interface StoreDetail extends Store {
  menus: Menu[];
  timeSlots: TimeSlot[];
  currentAvailableSeats: number | null;
  redirectCode: string | null;
}

export enum RoleEnum {
  ADMIN = "ADMIN",
  OWNER = "OWNER",
  STAFF = "STAFF",
  USER = "USER",
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
  role: RoleEnum;
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
  category: MenuCategory;
  storeId: number;
}

export interface ReservationResponse {
  id: number;
  headcount: number;
  reservationNum: number;
  userId: number;
  phone: string;
  storeId: number;
  timeSlotId: number;
  isConfirmed: boolean | null;
  isDone: boolean;
  token: string | null;
  menus: Menu[];
  user: User;
  store: Store;
  timeSlot: ReservationTimeSlot;
}

// API 요청/응답 타입들
export interface CreateStoreDto {
  name: string;
  description?: string;
  organizer?: string;
  college: string;
  icon: number;
  totalCapacity: number;
  contactInfo?: string;
  startTime: Date;
  endTime: Date;
  reservationFee: number;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  location: string;
  latitude: number;
  longitude: number;
  timeSlots: {
    startTime: Date;
    endTime: Date;
  }[];
}

export interface CreateMenuDto {
  name: string;
  category: "Tang" | "Tuiguim" | "Bap" | "Fruit" | "Maroon5" | "Beverage";
  price: number;
  storeId: number;
  imageUrl?: string;
}

export interface FilterVariables {
  days: string;
  maxFee: number;
}

export interface Notification {
  id: number;
  notificationId: number;
  title: string;
  message: string;
  url: string;
  type:
    | "OwnerApplication"
    | "OwnerReservation"
    | "Reservation"
    | "ReservationReminder";
  storeId: number | null;
  isRead: boolean;
  createTime: string;
}

export interface Festival {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  latitude: number;
  longitude: number;
}
