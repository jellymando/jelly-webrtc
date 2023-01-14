import React, { forwardRef, useCallback, useEffect } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { ROLE } from "constants/message";

import useWebRTC from "hooks/useWebRTC";

const Container = styled.div`
  height: 90%;
`;

const Button = styled.button`
  color: ${COLOR.WHITE1};
  border-radius: 10px;
  background-color: ${COLOR.BLUE2};
`;

const Nav = forwardRef<HTMLVideoElement | null, { role: string }>(
  ({ role }: { role: string }, ref) => {
    const { isSharing, initRTC, startScreenShare, closeScreenShare } =
      useWebRTC();

    const handleScreenShare = useCallback(async () => {
      if (isSharing) {
        closeScreenShare();
      } else {
        await startScreenShare();
      }
    }, [isSharing]);

    useEffect(() => {
      if (typeof ref !== "function") {
        if (ref!.current) initRTC({ role: ROLE.CLIENT, video: ref!.current });
      }
    }, []);

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
  }
);

export default Nav;
