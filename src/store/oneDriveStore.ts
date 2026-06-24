import { create } from "zustand";

interface OneDriveState {
  accessToken: string | null;

  accountName: string | null;

  setConnection: (token: string, name: string) => void;

  disconnect: () => void;
}

export const useOneDriveStore = create<OneDriveState>((set) => ({
  accessToken: null,

  accountName: null,

  setConnection: (token, name) =>
    set({
      accessToken: token,
      accountName: name,
    }),

  disconnect: () =>
    set({
      accessToken: null,
      accountName: null,
    }),
}));
