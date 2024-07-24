"use client";

import { useRouter } from "next/navigation";
import { v1 as uuid } from "uuid";
import { Navbar } from "./_components/navbar";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();

  function create() {
    const id = uuid();
    router.push(`/room/${id}`);
  }

  return (
    <div className="min-h-screen">
      <section className="min-h-screen">
        <Navbar />

        <div className="relative isolate px-6 pt-10 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                Stay Connected with FaceView
              </h1>

              <p className="mt-2 lg:mt-4 text-sm lg:text-lg lg:leading-8 text-gray-500 font-semibold">
                Connect, converse, and collaborate with people everywhere using
                FaceView.
              </p>
            </div>

            <div className="flex mt-10 gap-x-3">
              <Button onClick={create}>
                <Video className="mr-2 h-4 w-4" />
                New meeting
              </Button>

              <Input type="text" placeholder="Enter meeting link" />
              <Button variant="secondary" disabled>
                Join
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
