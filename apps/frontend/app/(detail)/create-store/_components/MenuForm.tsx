"use client";

import { useCreateStoreStore } from "@/app/stores/createStore";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createMenu } from "@/lib/api/menu";
import {
  createStore,
  getMenuImagePresignedUrl,
  getStoreImagePresignedUrl,
  updateStoreImageUrl,
  uploadToS3,
} from "@/lib/api/store";
import { cn } from "@/lib/utils";
import {
  transformFormDataToStoreData,
  transformMenuItemsToMenuData,
} from "@/lib/utils/store-utils";
import { Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MENU_CATEGORIES = [
  "탕/전골",
  "튀김류",
  "밥/식사",
  "과일",
  "마른안주",
  "음료",
];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: File | null;
  imagePreview: string | null;
}

export default function MenuForm() {
  const {
    formData,
    setFormData,
    nextModal,
    setCreatedStoreId,
    isEditMode,
    editingStoreId,
  } = useCreateStoreStore(state => state);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    formData.menuItems || []
  );
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    id: "",
    name: "",
    price: 0,
    category: "탕/전골",
    image: null,
    imagePreview: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 메뉴 아이템 추가
  const handleAddMenuItem = () => {
    if (!currentItem.name.trim()) {
      alert("메뉴명을 입력해주세요.");
      return;
    }

    if (currentItem.price < 0) {
      alert("가격을 입력해주세요.");
      return;
    }

    if (menuItems.length >= 10) {
      alert("메뉴는 최대 10개까지 등록 가능합니다.");
      return;
    }

    const newItem: MenuItem = {
      ...currentItem,
      id: `menu_${Date.now()}_${Math.random()}`,
    };

    const updatedItems = [...menuItems, newItem];
    setMenuItems(updatedItems);
    setFormData({ ...formData, menuItems: updatedItems });

    // 폼 초기화
    setCurrentItem({
      id: "",
      name: "",
      price: 0,
      category: "탕/전골",
      image: null,
      imagePreview: null,
    });
  };

  // 메뉴 아이템 삭제
  const handleRemoveMenuItem = async (id: string) => {
    const { deleteMenu } = await import("@/lib/api/menu");
    await deleteMenu(id);
    const updatedItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedItems);
    setFormData({ ...formData, menuItems: updatedItems });
  };

  // 최종 제출 - 주점 등록
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);

      let storeId: number;
      if (isEditMode && editingStoreId) {
        // 수정 모드: 스토어 정보 업데이트 (필요한 필드만)
        const { updateStore } = await import("@/lib/api/store");
        const partialData = transformFormDataToStoreData(formData);
        await updateStore(editingStoreId, partialData);
        storeId = editingStoreId;
      } else {
        // 생성 모드
        const storeData = transformFormDataToStoreData(formData);
        const storeResponse = (await createStore(storeData)) as { id: number };
        storeId = storeResponse.id;
        setCreatedStoreId(storeId);
      }

      const imageUploadPromises = [];
      const imageUrls: Record<string, string> = {};

      if (formData.representativeImage) {
        const storeImagePromise = (async () => {
          const presignedData = (await getStoreImagePresignedUrl(storeId, {
            fileIdx: `main_image_${Date.now()}`,
            contentType: formData.representativeImage!.type,
          })) as {
            fields: Record<string, string>;
            publicUrl: string;
          };
          await uploadToS3(presignedData.fields, formData.representativeImage!);
          await updateStoreImageUrl(storeId, presignedData.publicUrl);
        })();
        imageUploadPromises.push(storeImagePromise);
      }

      // 새로운 메뉴만 필터링 (기존 메뉴는 숫자 ID, 새 메뉴는 'menu_' 접두사)
      const newMenuItems = menuItems.filter(
        menuItem => menuItem.id.startsWith("menu_") // 새로 추가된 메뉴만
      );

      newMenuItems.forEach((menuItem, index) => {
        if (menuItem.image) {
          const menuImagePromise = (async () => {
            const presignedData = (await getMenuImagePresignedUrl({
              storeId,
              fileIdx: `${index}_${Date.now()}`,
              contentType: menuItem.image!.type,
            })) as {
              fields: Record<string, string>;
              publicUrl: string;
            };

            await uploadToS3(presignedData.fields, menuItem.image!);
            imageUrls[menuItem.id] = presignedData.publicUrl;
          })();
          imageUploadPromises.push(menuImagePromise);
        }
      });

      await Promise.all(imageUploadPromises);

      if (newMenuItems.length > 0) {
        const menuData = transformMenuItemsToMenuData(
          newMenuItems,
          storeId,
          imageUrls
        );
        const menuPromises = menuData.map(menu => createMenu(menu));
        await Promise.all(menuPromises);
      }

      nextModal();
    } catch (error) {
      console.error("주점 등록 실패:", error);
      alert("주점 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 선택 처리
  const handleImageSelect = (file: File) => {
    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 미리보기 URL 생성
    const reader = new FileReader();
    reader.onload = e => {
      const previewUrl = e.target?.result as string;
      setCurrentItem({
        ...currentItem,
        image: file,
        imagePreview: previewUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  // 파일 입력 변경 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = () => {
    setCurrentItem({
      ...currentItem,
      image: null,
      imagePreview: null,
    });
  };

  // 파일 선택 버튼 클릭
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // 편집 모드에서 formData 변경 시 동기화
  useEffect(() => {
    setMenuItems(formData.menuItems || []);
  }, [formData]);

  // 컴포넌트 언마운트 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (currentItem.imagePreview) {
        URL.revokeObjectURL(currentItem.imagePreview);
      }
      menuItems.forEach(item => {
        if (item.imagePreview) {
          URL.revokeObjectURL(item.imagePreview);
        }
      });
    };
  }, [currentItem.imagePreview, menuItems]);

  return (
    <div className="space-y-20">
      <div className="text-primary-normal mb-[2px] text-xs">4단계</div>
      <div className="mb-1.5 text-xl font-medium">메뉴를 등록해주세요</div>
      <div className="text-color-neutral-50 mb-5 text-xs">
        메뉴를 등록하면 더 많은 손님을 모을 수 있어요!
      </div>

      {/* 메뉴 입력 폼 */}
      <div className="space-y-1.5">
        {/* 이미지 업로드 */}
        <div className="space-y-2">
          {currentItem.imagePreview ? (
            // 이미지가 선택된 경우
            <div className="relative">
              <div className="relative h-[200px] w-full overflow-hidden rounded-md border">
                <Image
                  src={currentItem.imagePreview}
                  alt="메뉴 이미지 미리보기"
                  fill
                  className="object-cover"
                />
                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white"
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSelectImage}
                className="border-primary-normal text-primary-normal mt-2 w-full rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                다른 이미지 선택하기
              </button>
            </div>
          ) : (
            // 이미지가 선택되지 않은 경우
            <div
              className={cn(
                "relative h-[200px] w-full rounded-md border-2 border-dashed transition-colors",
                isDragOver
                  ? "border-primary-normal bg-primary-normal/5"
                  : "border-color-neutral-95 bg-color-neutral-99"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="bg-color-neutral-95 flex h-12 w-12 items-center justify-center rounded-full">
                  <Upload className="text-color-neutral-60 h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-color-neutral-70 text-sm font-medium">
                    이미지를 드래그하거나 클릭하여 선택하세요
                  </p>
                  <p className="text-color-neutral-50 text-xs">
                    JPG, PNG, GIF (최대 5MB)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectImage}
                  className="bg-primary-normal hover:bg-primary-normal/90 rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  이미지 선택
                </button>
              </div>
            </div>
          )}

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 카테고리 선택 */}
        <ScrollArea>
          <div className="flex gap-1 pb-2">
            {MENU_CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setCurrentItem({ ...currentItem, category })}
                className={cn(
                  "whitespace-nowrap rounded-full px-[14px] py-2 text-sm font-medium transition-colors",
                  currentItem.category === category
                    ? "bg-black text-white"
                    : "border-color-line text-color-neutral-70 border bg-white"
                )}
              >
                {category}
              </button>
            ))}
            <ScrollBar orientation="horizontal" className="hidden" />
          </div>
        </ScrollArea>

        {/* 메뉴명 */}
        <div className="flex gap-2">
          <div className="flex w-20 items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="text-sm">메뉴명</label>
          </div>
          <input
            type="text"
            value={currentItem.name}
            onChange={e =>
              setCurrentItem({ ...currentItem, name: e.target.value })
            }
            placeholder="메뉴명을 입력하세요"
            className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-3 text-sm"
            maxLength={20}
          />
        </div>

        {/* 가격 */}
        <div className="flex gap-2">
          <div className="flex w-20 items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="text-sm">가격(원)</label>
          </div>
          <input
            type="number"
            value={currentItem.price ?? ""}
            onChange={e =>
              setCurrentItem({ ...currentItem, price: Number(e.target.value) })
            }
            placeholder="0"
            className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-3 text-sm"
            min="0"
          />
        </div>

        {/* 추가하기 버튼 */}
        <button
          type="button"
          onClick={handleAddMenuItem}
          className="border-primary-normal text-primary-normal mt-6 w-full rounded-md border bg-white px-4 py-3 text-sm font-medium"
        >
          <Plus className="mr-2 inline h-4 w-4" />
          추가하기
        </button>
      </div>

      {/* 등록된 메뉴 목록 */}
      {menuItems.length > 0 && (
        <div className="mb-13 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">
              등록된 메뉴 ({menuItems.length}/10)
            </label>
          </div>
          <div className="space-y-3">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border p-3"
              >
                {item.imagePreview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={item.imagePreview}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMenuItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={handleFinalSubmit}
        disabled={isSubmitting}
        className="bg-primary-normal w-full rounded-md px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isEditMode
          ? isSubmitting
            ? `수정 중...`
            : "수정 완료하기"
          : isSubmitting
            ? `등록 중...`
            : "주점 등록하기"}
      </Button>
    </div>
  );
}
