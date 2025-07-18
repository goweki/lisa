"use client";

export function Loader({ className }: { className?: string }) {
  return (
    <div
      className={`
        flex flex-1 w-full h-full
        items-center justify-center
        space-x-2 pt-1
        loader
        [&>*]:bg-gray-500
        [&>*:nth-child(even)]:bg-emerald-600
        [&>*]:w-4 [&>*]:h-4
        [&>*]:rounded-full
        ${className || ""}
      `}
    >
      <div className="animate-[loader_0.6s_infinite_alternate]"></div>
      <div className="animate-[loader_0.6s_infinite_alternate] delay-100"></div>
      <div className="animate-[loader_0.6s_infinite_alternate] delay-300"></div>
      <div className="animate-[loader_0.6s_infinite_alternate] delay-600"></div>
    </div>
  );
}
