import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function LatestHeadline() {
  return (
    <div className="flex justify-between min-w-full mt-2">
      <div className="text-muted-foreground mx-2 flex items-center">Topic</div>
      <div>
        <Button className="text-muted-foreground text-base hover:bg-muted rounded-none h-[50px]">
          Replies
        </Button>
        <Button className="text-muted-foreground text-base hover:bg-muted rounded-none h-[50px]">
          Views
        </Button>
        <Button className="text-muted-foreground text-base hover:bg-muted rounded-none h-[50px]">
          Activity
        </Button>
      </div>
    </div>
  );
}

export function CategoryHeadline() {
  return (
    <div className="flex justify-between min-w-full mt-4 gap">
      <div className="w-[48%]">
        <div className="flex justify-between mb-3">
          <div className="text-muted-foreground mx-2 flex items-center">
            Category
          </div>
          <div className="text-muted-foreground mx-2 flex items-center justify-end">
            Topics
          </div>
        </div>
        <Separator className="h-[3px] mb-3 w-full" />
      </div>
      <div className="w-[48%]">
        <div className="flex justify-between mb-3">
          <div className="text-muted-foreground mx-2 flex items-center">
            Top
          </div>
        </div>
        <Separator className="h-[3px] mb-3 w-full" />
      </div>
    </div>
  );
}
