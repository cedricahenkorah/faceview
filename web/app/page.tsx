"use client";

import { useRouter } from "next/navigation";
import { v1 as uuid } from "uuid";
import { Navbar } from "./_components/navbar";
import { Button } from "@/components/ui/button";
import { Link, TvMinimalPlay, Video, Copy } from "lucide-react";
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
    <div className="min-h-screen">
      <section className="min-h-screen">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />

        <div className="relative isolate px-6 pt-10 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h1 className="text-xl md:text-3xl lg:text-5xl font-semibold tracking-tight text-gray-900">
                Stay Connected with FaceView
              </h1>

              <p className="mt-2 lg:mt-4 text-sm lg:text-lg lg:leading-8 text-gray-500 font-semibold">
                Connect, converse, and collaborate with people everywhere using
                FaceView.
              </p>
            </div>

            <div className="flex mt-10 gap-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
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
        </div>
      </section>
    </div>
  );
}
