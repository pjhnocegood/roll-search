// import pb from "@/api/pocketbase";
import api from "@/lib/api";
import { ITopicProps } from "@/types/topic";
import { useQuery } from "@tanstack/react-query";

export default function useTopic(id:string|undefined) {
  return useQuery<ITopicProps>({
    queryKey: [`topic/${id}`],
     queryFn: async (): Promise<ITopicProps> => {
      const response = await api.get(`/wiki/${id}`)
      const data = response.data;
      return data;
     },
   });
}
