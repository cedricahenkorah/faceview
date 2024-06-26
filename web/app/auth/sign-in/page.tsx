"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const data = { username, password };

    const response = await toast.promise(
      signIn("credentials", { ...data, redirect: false }),
      {
        loading: "Hang on, just a moment...",
        success: "You have been logged in successfully",
        error: "An error occurred. Sorry, try again later.",
      }
    );

    if (!response?.error) {
      router.push("/call");
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
            <form className="flex flex-col" onSubmit={handleLogin}>
              <h1 className="font-bold text-base lg:text-xl">
                Sign In to <span className="text-blue-700">faceview</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Welcome back, continue connecting with your friends on faceview
              </p>

              <div className="mt-10 gap-y-5">
                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-3 lg:mb-5 mt-2 p-2 lg:py-2 lg:px-2 rounded-md border border-gray-200 focus:ring-offset-0 focus:ring-0 text-sm"
                  />
                </div>

                <p className="text-gray-500 text-xs lg:text-sm mb-3">
                  Forgot Password?
                </p>

                <Button className="w-full" type="submit">
                  Login
                </Button>

                <p className="text-gray-500 text-xs lg:text-sm mt-3 lg:mt-5">
                  Don&apos;t have an account{" "}
                  <Link href="/auth/sign-in">
                    <span className="font-semibold text-black">Sign up</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
