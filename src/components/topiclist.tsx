"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import useTopics from "@/hooks/useTopics";

export default function TopicList() {
  const router = useRouter();
  const { data, isLoading, error } = useTopics();
  const Topics = data;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const Acitivity = (createdAt: string) => {
    const targetDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - targetDate.getTime(); // getTime()으로 number 타입 보장
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return diffMinutes;
  };

  return (
    <div className="min-w-full">
      {Topics &&
        Topics.map((topic) => {
          return (
            <div key={topic.id} className="min-w-full">
              <div className="justify-between flex">
                <div className="w-2/3">
                  <Button
                    className="text-xl px-0 py-0 min-h-[30px] whitespace-pre-wrap text-start"
                    onClick={() => {
                      router.push(`/topic/${topic.id}`);
                    }}
                  >
                    {topic.title}
                  </Button>
                  <div className="gap-2 flex">
                    <Button size="sm" className="px-0 justify-start">
                      {topic.category}
                    </Button>
                    {topic.tags &&
                      topic.tags.map((tag) => {
                        return (
                          <Button
                            key={tag.id}
                            size="sm"
                            className="px-0 justify-start"
                          >
                            {tag.name}
                          </Button>
                        );
                      })}
                  </div>
                </div>
                <div className="flex items-center">
                  <Button className="text-muted-foreground font-bold text-base rounded-none h-[50px] min-w-[80px]">
                    {topic.comments.length}
                  </Button>
                  <Button className="text-muted-foreground text-base rounded-none h-[50px] min-w-[80px]">
                    {topic.views}
                  </Button>
                  <Button className="text-muted-foreground text-base rounded-none h-[50px] min-w-[80px]">
                    {Acitivity(topic.createdAt)}m
                  </Button>
                </div>
              </div>

              <Separator className="h-[1px] my-4" />
            </div>
          );
        })}
    </div>
  );
}
