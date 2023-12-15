"use client";
import { useRouter } from "next/navigation";

export default function Portal() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-4 max-w-screen-xl">
      <h1 className="col-span-2">This is the settings page...</h1>
      <div className="col-span-2 md:col-span-1 bg-emerald-500 ">card A</div>
      <div className="col-span-2 md:col-span-1 bg-emerald-500 ">card B</div>
    </div>
  );
}
