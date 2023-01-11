import React, { useState, useCallback } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { KEY } from "constants/message";

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

const Nav = () => {
  const { sendMessage } = useSocket();
  const { startScreenShare, closeScreenShare } = useWebRTC();
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

  return (
    <Container>
      <Button onClick={handleScreenShare}>화면공유</Button>
      <Button onClick={() => {}}>그리기</Button>
      <Button onClick={() => {}}>음성채팅</Button>
    </Container>
  );
};

export default Nav;
