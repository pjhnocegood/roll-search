import { create } from 'zustand';

type JWTState = {
  token: string;
  setToken: (token: string) => void;
};

export const useJWT = create<JWTState>((set) => ({
  token: "",
  setToken: (token: string) => set(() => ({ token })),
}));
