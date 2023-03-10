import React, { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { socket } from "libs/socket";
import { videoAtom, isPausedAtom, isDrawAtom } from "store/atoms/video";
import { COLOR } from "types/style";
import { ROLE } from "types/message";
import { CONNECTION_EVENT } from "types/rtc";

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
  const setIsPaused = useSetRecoilState(isPausedAtom);
  const setIsDraw = useSetRecoilState(isDrawAtom);
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
    setIsPaused(true);
    setIsDraw(true);
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
