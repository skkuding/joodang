interface ReservationCancelModalProps {
  open: boolean;
  onClose: () => void;
}
export default function ReservationCancelModal({
  open,
  onClose,
}: ReservationCancelModalProps) {
  return (
    <div>
      <div
        className={`fixed inset-0 z-[20] bg-black/80 backdrop-blur-[10px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"} `}
        style={{ bottom: 0 }}
        onClick={onClose}
      />
      <div
        className={`bg-color-common-100 fixed z-[30] flex h-[289px] w-[335px] flex-col px-5 pb-6 pt-5 ${open ? "opacity-100" : "opacity-0"} `}
      >
        <div>x</div>
        <div>icon</div>
        <p>예약을 취소하시겠습니까?</p>
        <div>
          <p>예약 취소 시 선입금은 별도로 환불받으셔야 하며, </p>
          <p>환불 관련 수수료 및 처리 기간은 해당 주점에</p>
          <p>직접 문의해 주시기 바랍니다.</p>
        </div>
        <button>취소할게요</button>
      </div>
    </div>
  );
}
