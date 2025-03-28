'use client'

import { HouseIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Library } from "./library";

type SidebarProps = {
  children: ReactNode;
  songs: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    imageUrl: string;
  }[]
}

export const Sidebar = ({ children, songs }: SidebarProps) => {
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
        <Library songs={songs} />
      </div>

      {/* Main content */}
      <main className="h-full flex-1 py-2">
        {children}
      </main>
    </div>
  )
}
