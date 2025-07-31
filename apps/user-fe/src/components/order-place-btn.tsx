export default function OrderPlaceBtn({
  isBuy,
  width,
  height,
}: {
  isBuy: boolean;
  width: string;
  height: string;
}) {
  return (
    <>
      <div
        className={`w-${width} h-${height} border-1 ${isBuy ? "bg-green-300" : "bg-red-300"} border-black `}
      >
        <button
          className={`w-full h-full  hover:cursor-pointer text-2xl shadow-[2px_2px_1px] hover:shadow-[0px_2px_0px_2px]`}
        >
          {isBuy ? "Yes" : "No"}
        </button>
      </div>
    </>
  );
}
