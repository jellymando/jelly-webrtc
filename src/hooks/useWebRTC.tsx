import React, { useRef, useState, useCallback, useEffect } from "react";
import { EVENT } from "constants/message";
import { CONNECTION_STATE } from "constants/rtc";
import useSocket from "hooks/useSocket";

function useWebRTC() {
  const { socket, sendMessage } = useSocket();
  const signaling = new BroadcastChannel("webrtc");
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [role, setRole] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const initRTC = useCallback(
    ({ role, video }: { role: string; video: HTMLVideoElement }) => {
      setRole(role);
      videoRef.current = video;
    },
    []
  );

  const createPeerConnection = useCallback(() => {
    pcRef.current = new RTCPeerConnection();
    pcRef.current.onicecandidate = (e: any) => {
      const message = {
        type: "candidate",
        candidate: null
      } as any;
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      signaling.postMessage(message);
    };

    pcRef.current.addEventListener("connectionstatechange", (event: any) => {
      const connectionState = pcRef.current!.connectionState;
      console.log("connectionstatechange", connectionState);
      handleConnectionStateChange(connectionState);
    });
  }, []);

  const startScreenShare = useCallback(async () => {
    streamRef.current = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    });

    if (!pcRef.current) {
      createPeerConnection();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: any) =>
          pcRef.current!.addTrack(track, streamRef.current!)
        );

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }

      const offer = await pcRef.current!.createOffer();
      signaling.postMessage({ type: "offer", sdp: offer.sdp });
      await pcRef.current!.setLocalDescription(offer);
    } else {
      console.log("GET STREAM ERROR");
    }
  }, []);

  const closeScreenShare = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }
    setIsSharing(false);
  }, []);

  const handleOffer = useCallback(async (offer: any) => {
    createPeerConnection();

    if (videoRef.current) {
      pcRef.current!.ontrack = (e: any) => {
        console.log("ontrack", e);
        videoRef.current!.srcObject = e.streams[0];
      };
    }

    await pcRef.current!.setRemoteDescription(offer);
    const answer = await pcRef.current!.createAnswer();
    signaling.postMessage({ type: "answer", sdp: answer.sdp });
    await pcRef.current!.setLocalDescription(answer);
  }, []);

  const handleAnswer = useCallback(async (answer: any) => {
    await pcRef.current!.setRemoteDescription(answer);
  }, []);

  const handleCandidate = useCallback(async (candidate: any) => {
    await pcRef.current!.addIceCandidate(
      candidate.candidate ? candidate : null
    );
  }, []);

  const handleConnectionStateChange = useCallback((state: string) => {
    switch (state) {
      case CONNECTION_STATE.CONNECTED:
        setIsSharing(true);
        break;
      case CONNECTION_STATE.DISCONNECTED:
      case CONNECTION_STATE.FAILED:
        setIsSharing(false);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    // offer(CLIENT->VIEWER)-> answer(VIEWER->CLIENT) -> candidate(CLIENT->VIEWER) -> candidate(VIEWER->CLIENT)
    signaling.onmessage = async (e) => {
      console.log("e.data.type, role", e.data.type, role);
      switch (e.data.type) {
        case "offer":
          await handleOffer(e.data);
          break;
        case "answer":
          await handleAnswer(e.data);
          break;
        case "candidate":
          await handleCandidate(e.data);
          break;
        default:
          break;
      }
    };

    socket.on("message", (message) => {
      const { key, role, payload } = message;
      console.log("message", message);
      if (key === EVENT.CLOSE) {
        closeScreenShare();
      }
    });

    return () => {
      closeScreenShare();
    };
  }, []);

  return { isSharing, initRTC, startScreenShare, closeScreenShare };
}

export default useWebRTC;
