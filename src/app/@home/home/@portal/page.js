"use client";
import { useRouter } from "next/navigation";

export default function Portal() {
  const router = useRouter();
  return (
    <>
      <span onClick={() => router.back()}>Close modal</span>
      <h1>Portal</h1>
      ...
    </>
  );
}
