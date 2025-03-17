"use client";
import { Plus } from "lucide-react";
import { CategoryCombobox } from "./categorycombobox";
import { MenuTabs } from "./menutabs";
import { TagCombobox } from "./tagcombobox";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

export default function Headline() {
  const router = useRouter();
  const params = usePathname();

  return (
    <div className="min-w-full justify-between flex">
      <div className="justify-start flex gap-3">
        <CategoryCombobox />
        <TagCombobox />
        <MenuTabs defaultvalue={params.toString()} />
      </div>
      <div className="flex justify-end">
        <Button
          className="text-base text-black bg-muted border-r-0 hover:bg-gray-400 hover:text-white rounded-none"
          onClick={() => router.push("/create-topic")}
        >
          <Plus />
          New Topic
        </Button>
      </div>
    </div>
  );
}
