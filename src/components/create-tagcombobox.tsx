"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tags } from "@/lib/Tag";
import { useFilterData } from "@/hooks/useFilterData";

const tags = Tags;

export function CreateTagCombobox() {
  const [open, setOpen] = React.useState(false);
  //const [value, setValue] = React.useState("");
  const [values, setValues] = React.useState<string[]>([]);
  const { setTags } = useFilterData();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[70px] justify-start text-sm"
        >
          {values.length != 0 ? values.join(", ") : "optional tags"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No tag found.</CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={(currentValue) => {
                    if (values.includes(currentValue)) {
                      // 이미 선택된 값이면 해제
                      setValues(values.filter((v) => v !== currentValue));
                      setTags(values.filter((v) => v !== currentValue));
                    } else {
                      // 새 값이면 추가
                      setValues([...values, currentValue]);
                      setTags([...values, currentValue]);
                    }
                  }}
                >
                  {tag.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      values.includes(tag.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
