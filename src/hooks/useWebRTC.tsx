import React, { useRef, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";

import { socket } from "store/socket";
import { videoAtom } from "store/atoms/rtc";
import { CONNECTION_EVENT, CONNECTION_STATE } from "types/rtc";

type messageType = {
  type: string;
  candidate: string | null;
  sdpMid?: string | null;
  sdpMLineIndex: number | null;
};

function useWebRTC() {
  const video = useRecoilValue(videoAtom);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const createPeerConnection = useCallback(() => {
    pcRef.current = new RTCPeerConnection();
    pcRef.current.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      const message = {
        type: CONNECTION_EVENT.CANDIDATE,
        candidate: null
      } as messageType;

      if (e.candidate) {
        message.candidate = e.candidate.candidate;
        message.sdpMid = e.candidate.sdpMid;
        message.sdpMLineIndex = e.candidate.sdpMLineIndex;
      }
      socket.emit(CONNECTION_EVENT.CANDIDATE, message);
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
      socket.emit(CONNECTION_EVENT.OFFER, {
        type: CONNECTION_EVENT.OFFER,
        sdp: offer.sdp
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

  const handleConnectionStateChange = useCallback(
    (state: RTCPeerConnectionState) => {
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
    },
    []
  );

  const initRTC = useCallback(() => {
    socket.on(CONNECTION_EVENT.OFFER, async (message) => {
      console.log("OFFER", message);
      createPeerConnection();
      pcRef.current!.ontrack = (e: RTCTrackEvent) => {
        if (video) {
          video.srcObject = e.streams[0];
        }
      };
      await pcRef.current!.setRemoteDescription(message);
      const answer = await pcRef.current!.createAnswer();
      socket.emit(CONNECTION_EVENT.ANSWER, {
        type: CONNECTION_EVENT.ANSWER,
        sdp: answer.sdp
      });
      await pcRef.current!.setLocalDescription(answer);
    });

    socket.on(CONNECTION_EVENT.ANSWER, async (message) => {
      console.log("ANSWER", message);
      await pcRef.current!.setRemoteDescription(message);
    });

    socket.on(CONNECTION_EVENT.CANDIDATE, async (message) => {
      console.log("CANDIDATE", message);
      await pcRef.current!.addIceCandidate(message.candidate ? message : null);
    });

    socket.on(CONNECTION_EVENT.CLOSE, async (message) => {
      console.log("CLOSE", message);
      closeScreenShare();
    });
  }, [video]);

  return { isSharing, initRTC, startScreenShare, closeScreenShare };
}

export default useWebRTC;
