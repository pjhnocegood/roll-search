// import pb from "@/api/pocketbase";
import api from "@/lib/api";
import { ITopicProps } from "@/types/topic";
import { useQuery } from "@tanstack/react-query";

export default function useTopics() {
  return useQuery<ITopicProps[]>({
    queryKey: ["topics"],
     queryFn: async (): Promise<ITopicProps[]> => {
      const response = await api.get(`/wiki`)
      const data = response.data;
      return data;
     },
   });
}
