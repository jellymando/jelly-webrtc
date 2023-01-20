import React, { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { socket } from "store/socket";
import { videoAtom } from "store/atoms/rtc";
import { COLOR } from "types/style";
import { ROLE } from "types/message";
import { CONNECTION_EVENT, VIDEO_EVENT } from "types/rtc";

import useWebRTC from "hooks/useWebRTC";

const Container = styled.div`
  height: 90%;
`;

const Button = styled.button`
  color: ${COLOR.WHITE1};
  border-radius: 10px;
  background-color: ${COLOR.BLUE2};
`;

const Nav = ({ role }: { role: ROLE }) => {
  const video = useRecoilValue(videoAtom);
  const { isSharing, initRTC, startScreenShare, closeScreenShare } =
    useWebRTC();

  const handleScreenShare = useCallback(async () => {
    if (isSharing) {
      closeScreenShare();
      socket.emit(CONNECTION_EVENT.CLOSE);
    } else {
      await startScreenShare();
    }
  }, [isSharing, startScreenShare, closeScreenShare]);

  const handleDraw = useCallback(() => {
    socket.emit(VIDEO_EVENT.PAUSE);
  }, []);

  useEffect(() => {
    if (video) {
      initRTC();
    }
  }, [video]);

  return (
    <Container>
      {role === ROLE.CLIENT && (
        <Button onClick={handleScreenShare}>화면공유</Button>
      )}
      {role === ROLE.VIEWER && (
        <>
          <Button onClick={handleDraw}>그리기</Button>
          <Button onClick={() => {}}>음성채팅</Button>
        </>
      )}
    </Container>
  );
};

export default Nav;
