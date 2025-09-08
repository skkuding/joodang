interface ReservationInfoProps {
  reservationNum: string | null;
  isStandBy?: boolean;
}

export function ReservationInfo({
  reservationNum,
  isStandBy,
}: ReservationInfoProps) {
  return (
    <>
      <span className="bg-primary-normal/10 text-primary-normal mb-4 px-[21px] py-1 font-normal">
        {isStandBy ? "현장 대기 번호" : "예약 번호"}
      </span>
      <span className="text-primary-normal mb-3 flex h-[80px] items-center text-[80px] font-medium">
        {reservationNum}
      </span>
      <span className="mb-[6px] text-2xl font-medium">
        {isStandBy ? "현장 대기 완료!" : "예약이 신청되었어요!"}
      </span>
      <span className="text-sm font-normal">
        예약이 확정되면 알림을 보내드릴게요
      </span>
    </>
  );
}
