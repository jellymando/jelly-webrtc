import React, { useMemo, useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { isPausedAtom } from "store/atoms/video";
import { socket } from "libs/socket";
import { ROLE } from "types/message";
import { VIDEO_EVENT } from "types/video";

function useSocket() {
  const setIsPaused = useSetRecoilState(isPausedAtom);
  const myRole = useMemo(
    () =>
      window.location.pathname.replace("/", "") === ROLE.CLIENT
        ? ROLE.CLIENT
        : ROLE.VIEWER,
    []
  );

  const subscribe = useCallback(() => {
    socket.on(VIDEO_EVENT.PLAY, () => {
      setIsPaused(false);
    });

    socket.on(VIDEO_EVENT.PAUSE, () => {
      setIsPaused(true);
    });
  }, []);

  const initRoom = useCallback(
    (roomId) => {
      socket.emit("create", myRole);

      socket.on("create", (role) => {
        if (myRole !== role) {
          socket.emit("join", roomId);
        }
      });

      socket.on("join", (roomId) => {
        socket.emit("welcome", roomId);
      });

      socket.on("welcome", () => {
        subscribe();
      });
    },
    [myRole, subscribe]
  );

  const leaveRoom = useCallback((roomId) => {
    socket.emit("leave", roomId);
  }, []);

  const play = useCallback(() => {
    socket.emit("play");
  }, []);

  const pause = useCallback(() => {
    socket.emit("pause");
  }, []);

  return { initRoom, leaveRoom, play, pause };
}

export default useSocket;
