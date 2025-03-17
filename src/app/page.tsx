import Headline from "@/components/headline";
import LatestHeadline from "@/components/latestheadline";
import TopicList from "@/components/topiclist";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center w-3/4 place-self-center">
      <div className="flex flex-wrap min-w-full mt-7">
        <Headline />
        <LatestHeadline />
        <Separator className="h-[4px] mb-3" />
        <TopicList />
      </div>
    </div>
  );
}
