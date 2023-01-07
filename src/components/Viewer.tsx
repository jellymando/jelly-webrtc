import React, { useRef } from "react";
import styled from "styled-components";

import { COLOR } from "constants/color";

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

const Video = styled.video``;
const Canvas = styled.canvas``;

function Viewer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  return (
    <Container>
      <VideoWrap>
        <Canvas ref={canvasRef} />
        <Video ref={videoRef} autoPlay playsInline muted />
      </VideoWrap>
      <Nav video={videoRef.current} />
    </Container>
  );
}

export default Viewer;
