import React, { useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import useSocket from "hooks/useSocket";

const signaling = new BroadcastChannel("webrtc");

function useWebRTC() {
  const location = useLocation();
  const { sendMessage } = useSocket();
  const pcRef = useRef<any>(null);

  const createPeerConnection = useCallback(async (stream?: any) => {
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

    //나중에 ROLE로 분기하기
    if (stream) {
      stream
        .getTracks()
        .forEach((track: any) => pcRef.current.addTrack(track, stream));
    } else {
      const $video = document.getElementById("video") as HTMLVideoElement;
      console.log("$video", $video);
      if ($video) {
        pcRef.current.ontrack = (e: any) => {
          console.log("ontrack", e);
          $video.srcObject = e.streams[0];
        };
      }
    }
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
    console.log("stream", $video, stream);

    if (pcRef.current) return;
    await createPeerConnection(stream);

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

  useEffect(() => {
    signaling.onmessage = async (e) => {
      console.log("e.data.type", e.data.type);
      switch (e.data.type) {
        case "offer":
          await createPeerConnection();
          await pcRef.current.setRemoteDescription(e.data);

          const answer = await pcRef.current.createAnswer();
          signaling.postMessage({ type: "answer", sdp: answer.sdp });
          await pcRef.current.setLocalDescription(answer);
          break;
        case "answer":
          await pcRef.current.setRemoteDescription(e.data);
          break;
        case "candidate":
          if (!e.data.candidate) {
            await pcRef.current.addIceCandidate(null);
          } else {
            await pcRef.current.addIceCandidate(e.data);
          }
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
