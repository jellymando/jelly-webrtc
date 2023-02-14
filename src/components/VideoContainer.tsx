import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { SimpleCanvas } from "my-simple-canvas";

import { videoAtom, isPausedAtom, isDrawAtom } from "store/atoms/video";

import { throttle } from "utils/event";

import { COLOR } from "types/style";

type canvasWrapProps = {
  width: number;
  height: number;
};

const Container = styled.div`
  position: relative;
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
  z-index: 1;
`;

const CanvasWrap = styled.div<canvasWrapProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;

  canvas {
    width: ${({ width }) => (width ? `${width}px` : "100%")};
    height: ${({ height }) => (height ? `${height}px` : "100%")};
  }
`;

function VideoContainer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setVideo = useSetRecoilState(videoAtom);
  const [isPaused, setIsPaused] = useRecoilState(isPausedAtom);
  const [isDraw, setIsDraw] = useRecoilState(isDrawAtom);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  const resizeObserver = new ResizeObserver(
    throttle((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = entry.contentBoxSize[0];
          setVideoSize({
            width: contentBoxSize.inlineSize,
            height: contentBoxSize.blockSize
          });
        } else {
        }
      }
    }, 100)
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setVideo(video);
    setCanvasSize({ width: video.clientWidth, height: video.clientHeight });
    resizeObserver.observe(video);

    return () => {
      resizeObserver.unobserve(video);
    };
  }, []);

  useEffect(() => {
    isPaused ? pause() : play();
  }, [isPaused]);

  return (
    <Container>
      {isDraw && (
        <CanvasWrap width={videoSize.width} height={videoSize.height}>
          <SimpleCanvas width={canvasSize.width} height={canvasSize.height} />
        </CanvasWrap>
      )}
      <Video
        id="video"
        ref={videoRef}
        onPlay={handlePlay}
        autoPlay
        playsInline
        muted
      />
    </Container>
  );
}

export default VideoContainer;
