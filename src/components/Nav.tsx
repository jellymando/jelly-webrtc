import React, { forwardRef, useCallback } from "react";
import styled from "styled-components";
import { COLOR } from "constants/color";

const Container = styled.div`
  height: 90%;
`;

const Button = styled.button`
  color: ${COLOR.WHITE1};
  border-radius: 10px;
  background-color: ${COLOR.BLUE2};
`;

const Nav = ({ video }: { video: HTMLVideoElement | null }) => {
  const screenShare = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    });

    if (video && stream) {
      video.srcObject = stream;
    }
    console.log("stream", stream);
  }, []);

  return (
    <Container>
      <Button onClick={screenShare}>화면공유</Button>
    </Container>
  );
};

export default Nav;
