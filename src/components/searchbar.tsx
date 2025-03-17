import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function SearchForm() {
  return (
    <div className="flex flex-col w-full h-[42px]">
      <div className="search-box mx-auto my-auto w-full h-full">
        <form className="flex flex-row border rounded-sm w-full h-full items-center">
          <Separator orientation="vertical" />
          <Input
            className="h-10 w-full py-1 px-2 text-lg"
            type="text"
            placeholder="검색어를 입력해주세요"
          />
          <span className="flex items-center px-2">
            <Button className="w-7 h-7" variant="ghost">
              <Search className="h-5" />
            </Button>
          </span>
        </form>
      </div>
    </div>
  );
}
