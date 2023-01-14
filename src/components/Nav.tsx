import React, { forwardRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { KEY, ROLE } from "constants/message";

import useSocket from "hooks/useSocket";
import useWebRTC from "hooks/useWebRTC";

const Container = styled.div`
  height: 90%;
`;

const Button = styled.button`
  color: ${COLOR.WHITE1};
  border-radius: 10px;
  background-color: ${COLOR.BLUE2};
`;

const Nav = forwardRef<HTMLVideoElement | null>((props, ref) => {
  const { sendMessage } = useSocket();
  const { initRTC, startScreenShare, closeScreenShare } = useWebRTC();
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const handleScreenShare = useCallback(() => {
    if (isSharing) {
      closeScreenShare();
      sendMessage({ key: KEY.CLOSE });
    } else {
      startScreenShare();
    }
    setIsSharing(!isSharing);
  }, [isSharing]);

  useEffect(() => {
    if (typeof ref !== "function") {
      if (ref!.current) initRTC({ role: ROLE.CLIENT, video: ref!.current });
    }
  }, []);

  return (
    <Container>
      <Button onClick={handleScreenShare}>화면공유</Button>
      <Button onClick={() => {}}>그리기</Button>
      <Button onClick={() => {}}>음성채팅</Button>
    </Container>
  );
});

export default Nav;
