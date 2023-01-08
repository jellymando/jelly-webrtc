import React, { forwardRef, useCallback } from "react";
import styled from "styled-components";

import { COLOR } from "constants/style";
import { KEY } from "constants/message";

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
  const { startScreenShare, closeScreenShare } = useWebRTC();

  return (
    <Container>
      <Button onClick={startScreenShare}>화면공유</Button>
    </Container>
  );
};

export default Nav;
