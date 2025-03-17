"use client";
import Headline from "@/components/headline";
import { CategoryHeadline } from "@/components/latestheadline";

export default function CategoryHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center w-3/4 place-self-center">
      <div className="flex flex-wrap min-w-full mt-7">
        <Headline />
        <CategoryHeadline />
      </div>
    </div>
  );
}
