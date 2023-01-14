import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { ROLE } from "constants/message";

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

function Client() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Container>
      <VideoWrap>
        <Video ref={videoRef} autoPlay playsInline muted />
      </VideoWrap>
      <Nav ref={videoRef} role={ROLE.CLIENT} />
    </Container>
  );
}

export default Client;
