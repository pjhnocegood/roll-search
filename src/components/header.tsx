"use client";
import Link from "next/link";
import { NavigationMenuDemo } from "./menubar";

export const Header: React.FC = () => {
  return (
    <div className="justify-center flex sticky top-0 bg-white z-50 border">
      <div className="z-10 py-3 w-3/4 place-self-center flex items-center justify-between font-mono text-sm">
        <Link href={"/"}>
          <h1 className="font-mono text-xl font-extrabold">Rollsearch</h1>
        </Link>
        <NavigationMenuDemo />
      </div>
    </div>
  );
};
