"use client";

import { Navbar } from "@/app/_components/navbar";
import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export default function Room({ params }: { params: { id: string } }) {
  const userVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const otherUser = useRef<string | null>(null);
  const userStream = useRef<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isPartnerMuted, setIsPartnerMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const uri = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }

        userStream.current = stream;

        socketRef.current = io(`${uri}`);

        socketRef.current.emit("join room", params.id);
        console.log("Joining room:", params.id);

        socketRef.current.on("other user", (userID) => {
          console.log("Other user joined:", userID);
          callUser(userID);
          otherUser.current = userID;
        });

        socketRef.current.on("user joined", (userID) => {
          console.log("User joined:", userID);
          otherUser.current = userID;
        });

        socketRef.current.on("offer", handleRecieveCall);

        socketRef.current.on("answer", handleAnswer);

        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

        // Listen for when the other user disconnects
        socketRef.current?.on("user disconnected", (userID) => {
          console.log(`User disconnected: ${userID}`);
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = null; // Clear the video
          }
        });
      })
      .catch((e) => console.log(e));

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      console.log("close page");
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleCancelCall();
    };
  }, []);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    console.log("Page is about to be refreshed");
    socketRef.current?.emit("handleDisconnectCleanUp", params.id);
    event.preventDefault();
  };

  function handleCancelCall() {
    if (peerRef.current) {
      console.log("Closing peer connection");
      peerRef.current.close();
      peerRef.current = null;
    }

    if (userStream.current) {
      console.log("Stopping user media tracks");
      userStream.current.getTracks().forEach((track) => track.stop());
      userStream.current = null;
    }

    if (socketRef.current?.connected) {
      console.log("Disconnecting socket");
      socketRef.current.emit("handleDisconnectCleanUp", params.id, () => {
        console.log("Cleanup event sent, now disconnecting socket");
        socketRef.current?.disconnect();
      });
    } else {
      console.log("Socket is already disconnected");
    }
  }

  function callUser(userID: string) {
    console.log("Calling user:", userID);
    peerRef.current = createPeer(userID);
    userStream.current?.getTracks().forEach((track) => {
      console.log("Adding track to peer connection:", track);
      peerRef.current?.addTrack(track, userStream.current!);
    });
  }

  function createPeer(userID: string) {
    console.log("Creating peer connection for user:", userID);
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID: string) {
    console.log("Negotiation needed for user:", userID);

    peerRef.current
      ?.createOffer()
      .then((offer) => {
        console.log("Created offer:", offer);

        return peerRef.current?.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current?.id,
          sdp: peerRef.current?.localDescription,
        };
        console.log("Sending offer payload:", payload);
        socketRef.current?.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming: {
    sdp: RTCSessionDescriptionInit;
    caller: string;
  }) {
    console.log("Received call from:", incoming.caller);

    peerRef.current = createPeer(incoming.caller);
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      ?.setRemoteDescription(desc)
      .then(() => {
        userStream.current?.getTracks().forEach((track) => {
          console.log(
            "Adding track to peer connection after receiving call:",
            track
          );
          peerRef.current?.addTrack(track, userStream.current!);
        });
      })
      .then(() => {
        return peerRef.current?.createAnswer();
      })
      .then((answer) => {
        console.log("Created answer:", answer);
        return peerRef.current?.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current?.id,
          sdp: peerRef.current?.localDescription,
        };
        console.log("Sending answer payload:", payload);
        socketRef.current?.emit("answer", payload);
      });
  }

  function handleAnswer(message: { sdp: RTCSessionDescriptionInit }) {
    console.log("Received answer:", message.sdp);
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current?.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      console.log("Outgoing ICE candidate: ", e.candidate);
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current?.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming: RTCIceCandidateInit) {
    console.log("Incoming ICE candidate: ", incoming);
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current?.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e: RTCTrackEvent) {
    console.log("Received remote track");
    if (partnerVideo.current) {
      partnerVideo.current.srcObject = e.streams[0];
    }
  }

  function toggleAudio() {
    if (userStream.current) {
      userStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

      setIsAudioMuted(!isAudioMuted);
    }
  }

  function togglePartnerAudio() {
    if (partnerVideo.current) {
      partnerVideo.current.muted = !partnerVideo.current.muted;
      setIsPartnerMuted(!isPartnerMuted);
    }
  }

  function toggleVideo() {
    if (userStream.current) {
      userStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });

      setIsVideoOff(!isVideoOff);
    }
  }

  function switchCamera() {
    if (userStream.current) {
      userStream.current.getVideoTracks().forEach((track) => {
        track.stop();
      });

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          const newVideoTrack = stream.getVideoTracks()[0];
          userStream.current?.addTrack(newVideoTrack);
          if (userVideo.current) {
            userVideo.current.srcObject = userStream.current;
          }
        })
        .catch((e) => console.log(e));
    }
  }

  function endCall() {
    handleCancelCall();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />

      <div className="flex flex-col md:flex-row w-full flex-grow m-auto lg:max-w-7xl max-w-3xl px-5 pt-3 md:pt-5 gap-x-1 md:gap-x-3 lg:gap-x-5 gap-y-3">
        <div className="bg-white rounded-lg shadow-lg w-1/2 max-w-4xl aspect-video relative mb-10">
        <video
            ref={userVideo}
          autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 bg-opacity-50 rounded-full p-2">
            <Button
              onClick={toggleAudio}
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isAudioMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {isAudioMuted ? (
                <MicOff size={20} className="text-white" />
              ) : (
                <Mic size={20} />
              )}
            </Button>
            <Button
              onClick={toggleVideo}
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isVideoOff
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {isVideoOff ? (
                <VideoOff size={20} className="text-white" />
              ) : (
                <Video size={20} />
              )}
            </Button>
            <Button
              onClick={switchCamera}
              variant="ghost"
              size="icon"
              className="rounded-full bg-white hover:bg-gray-200"
              // disabled={cameras.length < 2}
            >
              <SwitchCamera size={20} />
            </Button>
            <Button
              onClick={endCall}
              variant="ghost"
              size="icon"
              className="rounded-full bg-red-500 hover:bg-red-600"
            >
              <PhoneOff size={20} className="text-white" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-1/2 max-w-4xl aspect-video relative mb-10">
        <video
            ref={partnerVideo}
          autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
          style={{ transform: "scaleX(-1)" }}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-gray-800 bg-opacity-50 rounded-full p-2">
            <Button
              onClick={togglePartnerAudio}
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isPartnerMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {isPartnerMuted ? (
                <MicOff size={20} className="text-white" />
              ) : (
                <Mic size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
