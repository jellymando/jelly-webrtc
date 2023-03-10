import React, { useMemo, useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";

import { isPausedAtom } from "store/atoms/video";
import { socket } from "libs/socket";
import { ROLE } from "types/message";
import { VIDEO_EVENT } from "types/video";

function useSocket() {
  const [isPaused, setIsPaused] = useRecoilState(isPausedAtom);
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

  useEffect(() => {
    socket.emit(isPaused ? VIDEO_EVENT.PAUSE : VIDEO_EVENT.PLAY);
  }, [isPaused]);

  return { initRoom, leaveRoom };
}

export default useSocket;
