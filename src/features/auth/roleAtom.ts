import { atom } from "jotai";

export const roleAtom = atom<string | null>(null)
export const roleLoadingAtom = atom<boolean>(true)