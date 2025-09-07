"use client";

import { useCreateStoreStore } from "@/app/stores/createStore";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

export default function ImageUploadForm() {
  const { formData, setFormData } = useCreateStoreStore(state => state);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFormData({
        ...formData,
        representativeImage: file,
        representativeImagePreview: previewUrl,
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
    setFormData({
      ...formData,
      representativeImage: null,
      representativeImagePreview: null,
    });
  };

  // 파일 선택 버튼 클릭
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // 컴포넌트 언마운트 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (formData.representativeImagePreview) {
        URL.revokeObjectURL(formData.representativeImagePreview);
      }
    };
  }, [formData.representativeImagePreview]);

  return (
    <div className="space-y-4">
      {formData.representativeImagePreview ? (
        // 이미지가 선택된 경우
        <div className="space-y-3">
          <div className="relative">
            <div className="relative h-[240px] w-full overflow-hidden rounded-md border">
              <Image
                src={formData.representativeImagePreview}
                alt="대표 이미지 미리보기"
                height={240}
                width={800}
                className="h-[240px] w-full object-cover object-center"
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
          </div>
          <button
            type="button"
            onClick={handleSelectImage}
            className="border-primary-normal text-primary-normal w-full rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
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
  );
}
