"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { Instance, SignalData } from "simple-peer";
import { Navbar } from "../_components/navbar";
import { PhoneOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Call() {
  const { data: session } = useSession();

  const [me, setMe] = useState("");
  const [stream, setStream] = useState<MediaStream | null | undefined>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState<string | undefined>("");
  const [callerSignal, setCallerSignal] = useState<SignalData | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState<string | undefined>("");

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket | null>();
  const connectionRef = useRef<Instance | null>();

  const uri = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    socket.current = io(`${uri}`);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.current.on("me", (id) => {
      setMe(id);
    });

    socket.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [uri]);

  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
      console.log("Assigned stream to myVideo");
    }
  }, [stream]);

  useEffect(() => {
    if (session?.user?.username) {
      setName(session.user.username);
    }
  }, [session]);

  function callUser(id: string) {
    console.log("id", id);
    console.log("call user");
    if (!stream) {
      console.error("MediaStream is null or undefined.");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    console.log("peer", peer);

    peer.on("signal", (data) => {
      console.log("sig call");
      socket.current?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    socket.current?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  function answerCall() {
    if (!stream) {
      console.error("MediaStream is null or undefined.");
      return;
    }

    if (!callerSignal) {
      console.error("Caller signal is undefined.");
      return;
    }

    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current?.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  }

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
  };

  let MyVideo;

  if (stream) {
    MyVideo = (
      <div className="relative w-1/2 rounded-lg border-4 border-blue-600 overflow-hidden">
        <video
          className="w-full h-full"
          playsInline
          muted
          ref={myVideo}
          autoPlay
        ></video>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end space-y-4 p-3">
          <div className="w-full flex justify-center items-center">
            {callAccepted && !callEnded ? (
              <div className="bg-red-600 p-3 rounded-full">
                <PhoneOff
                  color="white"
                  size={20}
                  strokeWidth={2.5}
                  onClick={leaveCall}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  let UserVideo;

  if (callAccepted && !callEnded) {
    UserVideo = (
      <video
        className="w-1/2 border-2 border-black"
        playsInline
        ref={userVideo}
        autoPlay
      ></video>
    );
  }

  let incomingCall;

  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} wants to faceview</h1>
        <button onClick={answerCall}>connect</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <div className="mx-auto lg:max-w-7xl max-w-3xl py-10 sm:py-14 lg:py-24">
          <div className="flex gap-x-3 bg-white">
            {MyVideo}

            {UserVideo}
          </div>

          <div className="w-full flex">
            <div className="w-1/2 text-center font-semibold text-white py-3">
              {session?.user.username}
            </div>

            <div className="w-1/2 text-center font-semibold text-white py-3">
              {caller}
            </div>
          </div>

          <div className="flex gap-x-3 mt-5 text-white">
            my id : {me}
            <p>name</p>
            <textarea
              name=""
              id=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-black text-black"
            />
            <p>id</p>
            <textarea
              name=""
              id=""
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              className="border border-black text-black"
            />
          </div>

          <div className="mt-3 text-white">
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall}>end call</button>
            ) : (
              <button onClick={() => callUser(idToCall)}>call user</button>
            )}

            <p className="text-white">{idToCall}</p>
          </div>

          <div className="mt-5 text-white">{incomingCall}</div>
        </div>
      </div>

      {/* footer */}
      <div className="text-white flex items-center justify-center h-16 bg-gray-800">
        <div className="h-16 w-full flex justify-center items-center gap-x-10">
          <div>Add Friend</div>

          <div>Call Friend</div>
        </div>
      </div>
    </div>
  );
}
