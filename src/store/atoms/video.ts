import { atom } from "recoil";

export const videoAtom = atom<HTMLVideoElement | null>({
  key: "video",
  default: null
});

export const isPausedAtom = atom({
  key: "isPaused",
  default: true
});

export const isDrawAtom = atom({
  key: "isDrawAtom",
  default: false
});
