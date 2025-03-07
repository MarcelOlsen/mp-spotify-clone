'use client'

import { HouseIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SidebarProps = {
  children: ReactNode;
  songs: {
    id: string;
    title: string;
    artist: string;
    duration: number;
  }[]
}

const navbarLink = [
  {
    title: "Home",
    href: "/",
    icon: HouseIcon
  },
  {
    title: "Search",
    href: "/search",
    icon: SearchIcon
  },
]

export const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname()

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[300px] bg-red-500 h-screen">
        {/* Main Section */}
        <div className="rounded-lg bg-yellow-200 w-full px-3 py-2 flex flex-col gap-y-2">
          <Link href="/" className={twMerge(
            "text-black flex items-center gap-x-1",
            pathname === "/" && "text-white"
          )}>
            <HouseIcon className="size-5" />
            Home
          </Link>
          <Link href="/search" className={twMerge(
            "text-black flex items-center gap-x-1",
            pathname === "/search" && "text-white"
          )}>
            <SearchIcon className="size-5" />
            Search
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  )
}
