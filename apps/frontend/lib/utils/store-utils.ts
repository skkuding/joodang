import { CreateStoreDto, CreateMenuDto } from "@/app/type";
import { FormData } from "@/app/stores/createStore";

// 메뉴 카테고리 enum
export enum MenuCategory {
  Tang = "tang", // 탕/전골
  Tuiguim = "tuiguim", // 튀김
  Bap = "bap", // 밥/식사
  Fruit = "fruit", // 과일
  Maroon5 = "maroon5", // 마른 안주
  Beverage = "beverage", // 음료
}

// 카테고리 매핑
export const mapCategoryToEnum = (category: string): MenuCategory => {
  const mapping: Record<string, MenuCategory> = {
    "탕/전골": MenuCategory.Tang,
    튀김류: MenuCategory.Tuiguim,
    "밥/식사": MenuCategory.Bap,
    과일: MenuCategory.Fruit,
    마른안주: MenuCategory.Maroon5,
    음료: MenuCategory.Beverage,
  };
  return mapping[category];
};

// FormData를 CreateStoreDto로 변환
export const transformFormDataToStoreData = (
  formData: FormData
): CreateStoreDto => {
  return {
    name: formData.name,
    description: formData.description,
    organizer: formData.organizer,
    college: formData.college,
    icon: formData.icon,
    totalCapacity: formData.totalCapacity,
    contactInfo: formData.contactInfo,
    startTime: formData.startTime ? new Date(formData.startTime) : new Date(),
    endTime: formData.endTime ? new Date(formData.endTime) : new Date(),
    reservationFee: formData.reservationFee,
    bankCode: formData.bankCode,
    accountNumber: formData.accountNumber,
    accountHolder: formData.accountHolder,
    location: formData.location,
    latitude: formData.latitude,
    longitude: formData.longitude,
    timeSlots: formData.timeSlots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  };
};

// 메뉴 아이템들을 CreateMenuDto 배열로 변환
export const transformMenuItemsToMenuData = (
  menuItems: FormData["menuItems"],
  storeId: number,
  imageUrls: Record<string, string> = {}
): CreateMenuDto[] => {
  return menuItems.map(menuItem => ({
    name: menuItem.name,
    price: menuItem.price,
    category: mapCategoryToEnum(menuItem.category),
    storeId: storeId,
    imageUrl: imageUrls[menuItem.id] || undefined,
  }));
};

// 폼 데이터 검증
export const isFormValid = (formData: FormData): boolean => {
  // 필수 필드 검증
  if (!formData.name || !formData.description || !formData.organizer) {
    return false;
  }

  if (!formData.college || !formData.contactInfo) {
    return false;
  }

  if (
    !formData.bankCode ||
    !formData.accountNumber ||
    !formData.accountHolder
  ) {
    return false;
  }

  if (
    !formData.location ||
    formData.latitude === 0 ||
    formData.longitude === 0
  ) {
    return false;
  }

  if (formData.timeSlots.length === 0) {
    return false;
  }

  return true;
};
