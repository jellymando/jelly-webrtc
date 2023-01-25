import React, { useRef, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { socket } from "libs/socket";
import { videoAtom } from "store/atoms/app";
import { COLOR } from "types/style";
import { VIDEO_EVENT } from "types/rtc";

const VideoWrap = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  border: 10px solid ${COLOR.BLUE4};
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas``;

function VideoContainer() {
  const setVideo = useSetRecoilState(videoAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const play = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const promise = video.play();

    if (promise !== undefined) {
      return promise
        .then((_) => {
          video.play();
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    setVideo(videoRef.current);

    socket.on(VIDEO_EVENT.PLAY, async () => {
      await play();
    });

    socket.on(VIDEO_EVENT.PAUSE, () => {
      videoRef.current!.pause();
    });
  }, []);

  return (
    <VideoWrap>
      <Canvas ref={canvasRef} />
      <Video ref={videoRef} autoPlay playsInline muted />
    </VideoWrap>
  );
}

export default VideoContainer;
