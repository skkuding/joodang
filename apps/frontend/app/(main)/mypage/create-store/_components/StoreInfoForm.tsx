"use client"

import { useCreateStoreStore } from "@/app/stores/createStore"
import { useCallback } from "react"

export default function StoreInfoForm() {
  const { formData, setFormData, nextModal } = useCreateStoreStore((state) => state)

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData({
        ...formData,
        [field]: value,
      })
    },
    [formData, setFormData]
  )

  const canProceed =
    formData.name.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    formData.phone.trim().length > 0 &&
    formData.accountNumber.trim().length > 0 &&
    formData.accountHolder.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div>1단계</div>
        <div>주점 정보를 입력해주세요</div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary-normal w-1.5 h-1.5" />
          <label className="block text-sm font-medium">주점명</label>
        </div>
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="주점명을 입력하세요"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">상세 설명</label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="주점 소개, 운영 안내 등을 적어주세요."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">전화번호</label>
        <input
          type="tel"
          inputMode="tel"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="예) 010-1234-5678"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium">입금받을 계좌</div>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">은행</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="예) 국민, 신한 등"
              value={formData.bankCode}
              onChange={(e) => handleChange("bankCode", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">계좌번호</label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="숫자만 입력"
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs text-gray-600">예금주</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="예금주명을 입력"
              value={formData.accountHolder}
              onChange={(e) => handleChange("accountHolder", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-40"
          onClick={nextModal}
          disabled={!canProceed}
        >
          다음
        </button>
      </div>
    </div>
  )
}


