import React, { useRef, useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { SimpleToolbar, SimpleCanvas } from "my-simple-canvas";

import { isPausedAtom, videoAtom } from "store/atoms/video";
import { COLOR } from "types/style";

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

function VideoContainer() {
  const setVideo = useSetRecoilState(videoAtom);
  const [isPaused, setIsPaused] = useRecoilState(isPausedAtom);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const pause = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    video.pause();
  }, []);

  const handlePlay = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    setVideo(videoRef.current);
  }, []);

  useEffect(() => {
    isPaused ? pause() : play();
  }, [isPaused]);

  return (
    <VideoWrap>
      {/* <SimpleCanvas /> */}
      <Video
        id="video"
        ref={videoRef}
        onPlay={handlePlay}
        autoPlay
        playsInline
        muted
      />
    </VideoWrap>
  );
}

export default VideoContainer;
