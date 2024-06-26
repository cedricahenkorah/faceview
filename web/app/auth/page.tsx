"use client";

import { Button } from "@/components/ui/button";
import { CreateUser } from "@/lib/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setState: (value: string) => void
  ) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = { email, username, password };

    const response = await toast.promise(CreateUser(data), {
      loading: "Hang on, we're setting up your account",
      success: "Your account has been created successfully",
      error:
        "An error occured while creating your account. Please try again later",
    });

    if (!response?.error) {
      router.push("/auth/sign-in");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <div className="flex gap-x-3 w-full relative">
        <div className="w-3/5 flex-grow flex relative">
          <div className="relative h-full w-full bg-slate-950">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
        </div>

        <div className="w-2/5 relative text-black flex">
          <div className="flex justify-center items-center w-full">
            <div className="flex flex-col">
              <h1 className="font-bold text-base lg:text-xl">
                Get Started with <span className="text-blue-700">faceview</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Start connecting with friends today on faceview
              </p>

              <form className="mt-10 gap-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange(e, setEmail)}
                    className="w-full mb-3 lg:mb-5 mt-2 p-2 lg:py-2 lg:px-2 rounded-md border border-gray-200 focus:ring-offset-0 focus:ring-0 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleInputChange(e, setUsername)}
                    className="w-full mb-3 lg:mb-5 mt-2 p-2 lg:py-2 lg:px-2 rounded-md border border-gray-200 focus:ring-offset-0 focus:ring-0 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm font-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => handleInputChange(e, setPassword)}
                    className="w-full mb-3 lg:mb-5 mt-2 p-2 lg:py-2 lg:px-2 rounded-md border border-gray-200 focus:ring-offset-0 focus:ring-0 text-sm"
                  />
                </div>

                <Button className="w-full" type="submit">
                  Create Account
                </Button>

                <p className="text-gray-500 text-xs lg:text-sm mt-3 lg:mt-5">
                  Already have an account{" "}
                  <Link href="/auth/sign-in">
                    <span className="font-semibold text-black">Sign in</span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
