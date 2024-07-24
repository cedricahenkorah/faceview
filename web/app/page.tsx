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
    <div className="min-h-screen flex">
      <div className="flex-grow flex justify-center items-center">
        <button onClick={create}>create room</button>
      </div>
    </div>
  );
}
