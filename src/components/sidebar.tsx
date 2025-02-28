import { ReactNode } from "react"

type SidebarProps = {
  children: ReactNode
}

const navbarLink = [
  {
    title: "Home",
    href: "/",
    icon: House
  },
  {

  }
]

export const Sidebar = ({ children }: SidebarProps) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-[300px] bg-red-500 h-screen">
        {/* Main Section */}
        <div className="rounded-lg bg-yellow-200 w-full">
          <p>home</p>
          <p>search</p>
        </div>
      </div>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  )
}
