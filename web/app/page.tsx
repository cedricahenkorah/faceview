"use client";

import { useRouter } from "next/navigation";
import { v1 as uuid } from "uuid";

export default function Home() {
  const router = useRouter();

  function create() {
    const id = uuid();
    router.push(`/room/${id}`);
  }

  return (
    <div className="min-h-screen p-20">
      <button className="bg-black text-white p-2" onClick={create}>
        create room
      </button>
    </div>
  );
}
