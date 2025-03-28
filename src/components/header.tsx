'use client'

import { ReactNode } from "react";
import { LuUser } from "react-icons/lu";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  children: ReactNode;
  className?: string;
}

export const Header = ({ children, className }: HeaderProps) => {
  return (
    <header className={twMerge(
      "h-fit bg-gradient-to-b from-emerald-800 p-6",
      className
    )}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="gap-x-2 items-center flex">
          <button
            onClick={() => { }}
            className="rounded-full p-2 bg-neutral-900 flex items-center justify-center hover:opacity-75"
          >
            <RxCaretLeft />
          </button>
          <button
            onClick={() => { }}
            className="rounded-full p-2 bg-neutral-900 flex items-center justify-center hover:opacity-75"
          >
            <RxCaretRight />
          </button>
        </div>
        <div>
          <button
            onClick={() => { }}
            className="rounded-full p-2 bg-neutral-900 flex items-center justify-center hover:opacity-75"
          >
            <LuUser />
          </button>
        </div>
      </div>
      {children}
    </header>
  )
}
