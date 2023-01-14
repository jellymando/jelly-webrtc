import React, { useRef, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";

import { socket } from "store/socket";
import { videoAtom } from "store/atoms/rtc";
import { EVENT } from "constants/message";
import { CONNECTION_STATE } from "constants/rtc";
import useSocket from "hooks/useSocket";

function useWebRTC() {
  const { sendMessage } = useSocket();
  const video = useRecoilValue(videoAtom);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const createPeerConnection = useCallback(() => {
    pcRef.current = new RTCPeerConnection();
    pcRef.current.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      const message = {
        type: EVENT.CANDIDATE,
        candidate: null
      } as {
        type: string;
        candidate: string | null;
        sdpMid?: string | null;
        sdpMLineIndex: number | null;
      };
      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      sendMessage({ key: EVENT.CANDIDATE, payload: message });
    };

    pcRef.current.addEventListener("connectionstatechange", (event: Event) => {
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
        .forEach((track: MediaStreamTrack) =>
          pcRef.current!.addTrack(track, streamRef.current!)
        );

      if (video) {
        video.srcObject = streamRef.current;
      }

      const offer = await pcRef.current!.createOffer();
      sendMessage({
        key: EVENT.OFFER,
        payload: { type: EVENT.OFFER, sdp: offer.sdp }
      });
      await pcRef.current!.setLocalDescription(offer);
    } else {
      console.log("GET STREAM ERROR");
    }
  }, [video]);

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

  const handleMessage = useCallback(
    async (message: { key?: string; payload?: any }) => {
      const { key, payload } = message;
      switch (key) {
        case EVENT.OFFER:
          createPeerConnection();
          pcRef.current!.ontrack = (e: RTCTrackEvent) => {
            if (video) {
              video.srcObject = e.streams[0];
            }
          };
          await pcRef.current!.setRemoteDescription(payload);
          const answer = await pcRef.current!.createAnswer();
          sendMessage({
            key: EVENT.ANSWER,
            payload: { type: EVENT.ANSWER, sdp: answer.sdp }
          });
          await pcRef.current!.setLocalDescription(answer);
          break;
        case EVENT.ANSWER:
          await pcRef.current!.setRemoteDescription(payload);
          break;
        case EVENT.CANDIDATE:
          await pcRef.current!.addIceCandidate(
            payload.candidate ? payload : null
          );
          break;
        case EVENT.CLOSE:
          closeScreenShare();
          break;
        default:
          break;
      }
    },
    [video]
  );

  const initRTC = useCallback(() => {
    socket.on("message", async (message: { key?: string; payload?: any }) => {
      await handleMessage(message);
    });
  }, [handleMessage]);

  return { isSharing, initRTC, startScreenShare, closeScreenShare };
}

export default useWebRTC;
