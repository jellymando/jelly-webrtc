import { atom } from "recoil";

export const socketRoomIdAtom = atom({
  key: "socketRoomId",
  default: ""
});

export const videoAtom = atom<HTMLVideoElement | null>({
  key: "video",
  default: null
});
