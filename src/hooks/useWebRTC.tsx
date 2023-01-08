import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ROLE } from "constants/message";

import useSocket from "hooks/useSocket";

function useWebRTC() {
  const signaling = new BroadcastChannel("webrtc");
  const location = useLocation();
  const { sendMessage } = useSocket();
  const pcRef = useRef<any>(null);
  const role = useMemo(
    () =>
      location.pathname.replace("/", "") === ROLE.CLIENT
        ? ROLE.CLIENT
        : ROLE.VIEWER,
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
      console.log("connectionstatechange", event);
    });
  }, []);

  const startScreenShare = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    });

    const $video = document.getElementById("video") as HTMLVideoElement;
    if ($video && stream) {
      $video.srcObject = stream;
      sendMessage({ payload: "클라이언트가 화면을 공유했습니다." });
    }

    if (!pcRef.current) {
      createPeerConnection();
    }

    if (stream) {
      stream
        .getTracks()
        .forEach((track: any) => pcRef.current.addTrack(track, stream));
    }

    const offer = await pcRef.current.createOffer();
    signaling.postMessage({ type: "offer", sdp: offer.sdp });
    await pcRef.current.setLocalDescription(offer);
  }, []);

  const closeScreenShare = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  }, []);

  const handleOffer = useCallback(async (offer: any) => {
    createPeerConnection();

    const $video = document.getElementById("video") as HTMLVideoElement;
    console.log("$video", $video);
    if ($video) {
      pcRef.current.ontrack = (e: any) => {
        console.log("ontrack", e);
        $video.srcObject = e.streams[0];
      };
    }

    await pcRef.current.setRemoteDescription(offer);
    const answer = await pcRef.current.createAnswer();
    signaling.postMessage({ type: "answer", sdp: answer.sdp });
    await pcRef.current.setLocalDescription(answer);
  }, []);

  const handleAnswer = useCallback(async (answer: any) => {
    console.log("role", role);
    await pcRef.current.setRemoteDescription(answer);
  }, []);

  const handleCandidate = useCallback(async (candidate: any) => {
    console.log("role", role);
    await pcRef.current.addIceCandidate(candidate.candidate ? candidate : null);
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

    return () => {
      closeScreenShare();
    };
  }, []);

  return { startScreenShare, closeScreenShare };
}

export default useWebRTC;
