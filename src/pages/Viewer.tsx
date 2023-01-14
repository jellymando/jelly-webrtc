import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { ROLE } from "constants/message";

import useWebRTC from "hooks/useWebRTC";
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
  const { isSharing, initRTC } = useWebRTC();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      initRTC({ video: videoRef.current, role: ROLE.VIEWER });
    }
  }, []);

  return (
    <Container>
      <VideoWrap>
        <Canvas ref={canvasRef} />
        <Video ref={videoRef} autoPlay playsInline muted />
      </VideoWrap>
      {isSharing && <Nav ref={videoRef} role={ROLE.VIEWER} />}
    </Container>
  );
}

export default Viewer;
