import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface MenuTabsProps {
  defaultvalue: string;
}

export function MenuTabs({ defaultvalue }: MenuTabsProps) {
  const router = useRouter();
  const selectedValue = defaultvalue === "/" ? "/latest" : defaultvalue;
  return (
    <Tabs defaultValue={selectedValue}>
      <TabsList className="flex w-full gap-5">
        <TabsTrigger
          value="/latest"
          onClick={() => {
            router.push("/latest");
          }}
        >
          Latest
        </TabsTrigger>
        <TabsTrigger
          value="/categories"
          onClick={() => {
            router.push("/categories");
          }}
        >
          Categories
        </TabsTrigger>
        <TabsTrigger
          value="/top"
          onClick={() => {
            router.push("/");
          }}
        >
          Top
        </TabsTrigger>
        <TabsTrigger
          value="/bookmarks"
          onClick={() => {
            router.push("/");
          }}
        >
          Bookmarks
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
