import React, { useRef, useState, useCallback, useEffect } from "react";
import { KEY } from "constants/message";
import useSocket from "hooks/useSocket";

function useWebRTC() {
  const signaling = new BroadcastChannel("webrtc");
  const { socket, sendMessage } = useSocket();
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [role, setRole] = useState("");

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
      console.log("connectionstatechange", pcRef.current!.connectionState);
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
      sendMessage({ payload: "클라이언트가 화면을 공유했습니다." });
    }

    const offer = await pcRef.current!.createOffer();
    signaling.postMessage({ type: "offer", sdp: offer.sdp });
    await pcRef.current!.setLocalDescription(offer);
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

  useEffect(() => {
    signaling.onmessage = async (e) => {
      console.log("e.data.type", e.data.type, pcRef.current);
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
      if (key === KEY.CLOSE) {
        closeScreenShare();
      }
    });

    return () => {
      closeScreenShare();
    };
  }, []);

  return { initRTC, startScreenShare, closeScreenShare };
}

export default useWebRTC;
