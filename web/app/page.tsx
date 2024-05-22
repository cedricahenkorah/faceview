"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v1 as uuid } from "uuid";
import { Socket, io } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

export default function Home() {
  const router = useRouter();

  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState<MediaStream | null | undefined>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState<string | undefined>("");
  const [callerSignal, setCallerSignal] = useState<SignalData | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket | null>();

  useEffect(() => {
    socket.current = io("http://localhost:7002/");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);

        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  function callPeer(id: string) {
    if (!stream) {
      console.error("MediaStream is null or undefined.");
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current?.emit("callUser", { userToCall: id, signalData: data });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
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
      socket.current?.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.signal(callerSignal);
  }

  let UserVideo;

  if (stream) {
    UserVideo = <video playsInline muted ref={userVideo}></video>;
  }

  let PartnerVideo;

  if (callAccepted) {
    PartnerVideo = <video playsInline ref={partnerVideo}></video>;
  }

  let incomingCall;

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
