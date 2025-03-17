"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Search } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import useUserProfile from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";

export function NavigationMenuDemo() {
  const router = useRouter();
  const user = useUserProfile().data;

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-2">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Search />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Menu />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex items-center">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Button
              className="max-w-[80px] px-0 mx-0"
              onClick={() => {
                router.push(
                  process.env.NEXT_PUBLIC_GITHUB_LOGIN || "/login-failed"
                );
              }}
            >
              {user ? (
                <Image
                  src={user.avatarUrl}
                  alt="profile"
                  width={40}
                  height={40}
                />
              ) : (
                "Login"
              )}
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className=" text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
