// import pb from "@/api/pocketbase";
import api from "@/lib/api";
import { Author } from "@/types/topic";
import { useQuery } from "@tanstack/react-query";

export default function useUserProfile() {
  return useQuery<Author>({
    queryKey: [`user`],
     queryFn: async (): Promise<Author> => {
      const response = await api.get(`/users/profile`)
      const data = response.data;
      return data;
     },
   });
}

import { create } from 'zustand';

type LoginState = {
  isLogIn: boolean;
  setIsLogin: (isLogIn: boolean) => void;
};

export const useLogIn = create<LoginState>((set) => ({
  isLogIn: false,
  setIsLogin: (isLogIn: boolean) => set(() => ({ isLogIn })),
}));

