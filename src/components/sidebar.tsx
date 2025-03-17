import { Separator } from "@/components/ui/separator";
import { Checkbox } from "./ui/checkbox";

export function Sidebar() {
  return (
    <aside className=" w-[242px] h-full">
      <div className="space-y-1 flex justify-between mb-7">
        <p className="text-xl font-extrabold">필터</p>
        <p className="text-muted-foreground text-sm underline hover:cursor-pointer">
          초기화
        </p>
      </div>
      <div className="flex items-center mb-7">
        <Checkbox id="terms" className="mr-2 hover:bg-secondary/80" />
        <label
          htmlFor="terms"
          className="text-base text-opacity-60 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
        >
          거래 가능만 보기
        </label>
      </div>
      <Separator className="opacity-50 my-6" />
      <div id="위치">
        <div className="text-base font-bold">위치</div>
        <div className="text-base my-4">서울특별시</div>
        <div></div>
        <Separator className="opacity-50 my-6" />
      </div>
      <div id="카테고리">
        <div className="text-base font-bold mb-3">카테고리</div>
      </div>
      <Separator className="opacity-50 my-6" />
      <div id="정렬">
        <div className="text-base font-bold mb-3">정렬</div>
      </div>
      <Separator className="opacity-50 my-6" />
      <div id="가격">
        <div className="text-base font-bold mb-3">가격</div>
      </div>
    </aside>
  );
}
