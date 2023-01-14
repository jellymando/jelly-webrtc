import React, { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { videoAtom } from "store/atoms/rtc";
import { COLOR } from "constants/style";
import { EVENT, ROLE } from "constants/message";

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

const Nav = ({ role }: { role: string }) => {
  const video = useRecoilValue(videoAtom);
  const { sendMessage } = useSocket();
  const { isSharing, initRTC, startScreenShare, closeScreenShare } =
    useWebRTC();

  const handleScreenShare = useCallback(async () => {
    if (isSharing) {
      closeScreenShare();
      sendMessage({ key: EVENT.CLOSE });
    } else {
      await startScreenShare();
    }
  }, [isSharing, startScreenShare, closeScreenShare]);

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
          <Button onClick={() => {}}>그리기</Button>
          <Button onClick={() => {}}>음성채팅</Button>
        </>
      )}
    </Container>
  );
};

export default Nav;
