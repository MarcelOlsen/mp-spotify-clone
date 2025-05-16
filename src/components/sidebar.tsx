'use client'

import { supabaseClient } from "@/libs/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { HouseIcon, Loader2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Library } from "./library";

type SidebarProps = {
  children: ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const { data: songs, isPending, error } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const req = await supabaseClient.from("songs").select()
      return req.data
    }
  });

  const pathname = usePathname()

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[300px] h-screen px-4 py-3 flex flex-col gap-y-2">
        {/* Main Section */}
        <div className="rounded-lg bg-neutral-900 w-full px-3 py-3 flex flex-col gap-y-4">
          <Link href="/" className={twMerge(
            "text-neutral-400 flex items-center gap-x-1 font-semibold",
            pathname === "/" && "text-white"
          )}>
            <HouseIcon className="size-6" />
            Home
          </Link>
          <Link href="/search" className={twMerge(
            "text-neutral-400 flex items-center gap-x-1 font-semibold",
            pathname === "/search" && "text-white"
          )}>
            <SearchIcon className="size-6" />
            Search
          </Link>
        </div>
        {
          isPending ? (
            <div>
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <Library songs={songs} />
          )
        }

      </div>

      {/* Main content */}
      <main className="h-full flex-1 py-2">
        {children}
      </main>
    </div>
  )
}
