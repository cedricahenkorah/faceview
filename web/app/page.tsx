"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { Instance, SignalData } from "simple-peer";

export default function Home() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState<MediaStream | null | undefined>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState<string | undefined>("");
  const [callerSignal, setCallerSignal] = useState<SignalData | undefined>();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState<string>("");

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
  }, []);

  function callUser(id: string) {
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
      <video className="" playsInline muted ref={myVideo} autoPlay></video>
    );
  }

  let UserVideo;

  if (callAccepted && !callEnded) {
    UserVideo = (
      <video className="" playsInline ref={userVideo} autoPlay></video>
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
    <div className="min-h-screen p-20">
      <div className="flex gap-x-3">
        {MyVideo}
        {UserVideo}
      </div>

      <div className="flex gap-x-3 mt-5">
        my id : {me}
        <p>name</p>
        <textarea
          name=""
          id=""
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-black"
        />
        <p>id</p>
        <textarea
          name=""
          id=""
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          className="border border-black"
        />
      </div>

      <div className="mt-3">
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall}>end call</button>
        ) : (
          <button onClick={() => callUser(idToCall)}>call user</button>
        )}

        <p className="text-black">{idToCall}</p>
      </div>

      <div className="mt-5 text-black">{incomingCall}</div>
    </div>
  );
}
