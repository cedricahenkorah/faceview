"use client";

import { useRouter } from "next/navigation";
import { v1 as uuid } from "uuid";
import { Navbar } from "./_components/navbar";
import { Button } from "@/components/ui/button";
import {
  Link,
  TvMinimalPlay,
  Video,
  Copy,
  Globe2,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ClipboardJS from "clipboard";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import Screenshot from "../public/screenshot.png";

export default function Home() {
  const router = useRouter();
  const [meetingID, setMeetingID] = useState("");
  const [ID, setID] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const clipboard = new ClipboardJS(".btn");

    clipboard.on("success", showToast);

    return () => {
      clipboard.destroy();
    };
  }, []);

  function create() {
    const id = uuid();
    router.push(`/room/${id}`);
  }

  function createLink() {
    const id = uuid();
    setID(id);
    setIsDialogOpen(true);
  }

  function joinMeeting() {
    const id = meetingID;
    router.push(`/room/${id}`);
  }

  function showToast() {
    toast.success("Link copied to clipboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="relative isolate px-6 pt-10 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Stay Connected with FaceView
            </h1>

            <p className="text-sm lg:text-lg text-slate-300">
              Connect, converse, and collaborate with people everywhere using
              FaceView&apos;s crystal-clear video platform.
            </p>
          </div>

          <div className="flex mt-10 gap-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                  <Video className="mr-2 h-4 w-4" />
                  New meeting
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={create}>
                    <TvMinimalPlay className="mr-2 h-4 w-4" />
                    <span>Start a meeting instantly</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={createLink}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Create a meeting for later</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              type="text"
              placeholder="Enter meeting ID"
              value={meetingID}
              onChange={(e) => setMeetingID(e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!meetingID}
              onClick={joinMeeting}
            >
              Join
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-xs sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to join this meeting.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input id="link" value={ID} readOnly />
                </div>
                <Button
                  size="sm"
                  className="btn px-3"
                  data-clipboard-target="#link"
                >
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-16 relative mx-auto max-w-6xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
          {/* <Image
            src={Screenshot}
            alt="Video call interface preview"
            className="rounded-xl shadow-2xl border border-slate-800"
          /> */}
        </div>
      </div>

      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Choose FaceView?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe2 className="h-8 w-8 text-purple-500" />,
                title: "Global Reach",
                description:
                  "Connect with anyone, anywhere in the world with our reliable global infrastructure.",
              },
              {
                icon: <Shield className="h-8 w-8 text-purple-500" />,
                title: "Secure Calls",
                description:
                  "End-to-end encryption ensures your conversations stay private and secure.",
              },
              {
                icon: <Users className="h-8 w-8 text-purple-500" />,
                title: "Team Collaboration",
                description:
                  "Perfect for team meetings, webinars, and virtual events with unlimited participants.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition"
              >
                <div className="p-3 bg-slate-800 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-800/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Start a Meeting in Seconds
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Meeting",
                description:
                  "Click 'New Meeting' to generate a unique meeting link instantly.",
              },
              {
                step: "02",
                title: "Share Link",
                description:
                  "Share the meeting link or ID with your participants.",
              },
              {
                step: "03",
                title: "Connect",
                description:
                  "Join the meeting with crystal-clear video and audio.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-purple-100 mb-8">
              Join millions of users who trust FaceView for their video
              communication needs.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-600 hover:bg-purple-50"
              onClick={createLink}
            >
              Start Free Meeting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Video className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-bold text-white">faceview</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-300">
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Security
              </a>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} FaceView. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
