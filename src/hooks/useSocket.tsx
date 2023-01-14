import React, { useCallback } from "react";

import { socket } from "store/socket";
import { EVENT } from "constants/message";

function useSocket() {
  const sendMessage = useCallback(
    ({ key = EVENT.MESSAGE, payload }: { key?: string; payload?: any }) => {
      socket.emit("sendMessage", { key, payload });
    },
    []
  );

  return { sendMessage };
}

export default useSocket;
