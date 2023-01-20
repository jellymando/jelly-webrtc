import React from "react";
import styled from "styled-components";

import { COLOR } from "types/style";
import { ROLE } from "types/message";

import VideoContainer from "components/VideoContainer";
import NavContainer from "components/NavContainer";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLOR.GRAY1};
`;

function Viewer() {
  return (
    <Container>
      <VideoContainer />
      <NavContainer role={ROLE.VIEWER} />
    </Container>
  );
}

export default Viewer;
