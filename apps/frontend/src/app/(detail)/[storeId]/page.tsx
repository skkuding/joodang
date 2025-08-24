import cheerImg from "@/assets/cheers.png";
import Image from "next/image";
export default function Page() {
  function renderStoreSummary() {
    return (
      <div className="p-20 pb-30 bg-white">
        <h2 className="text-xs font-normal text-primary-normal">SKKUDING</h2>
        <p className="text-gray-600">This is a brief summary of the store.</p>
      </div>
    );
  }
  function renderDescription() {
    return (
      <div className="p-4 bg-gray-100">
        <h2 className="text-lg font-bold">Store Description</h2>
        <p className="text-gray-600">
          This is a detailed description of the store.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="h-4 bg-white" />
      <Image src={cheerImg} alt="Description" className="w-full h-[257px]" />
      {renderStoreSummary()}
      {renderDescription()}
    </div>
  );
}
