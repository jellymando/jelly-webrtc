import React, { useRef, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { videoAtom } from "store/atoms/rtc";
import { COLOR } from "types/style";
import { ROLE } from "types/message";

import Nav from "components/Nav";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLOR.GRAY1};
`;

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

function Viewer() {
  const setVideo = useSetRecoilState(videoAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    setVideo(videoRef.current);
  }, []);

  return (
    <Container>
      <VideoWrap>
        <Canvas ref={canvasRef} />
        <Video ref={videoRef} autoPlay playsInline muted />
      </VideoWrap>
      <Nav role={ROLE.VIEWER} />
    </Container>
  );
}

export default Viewer;
