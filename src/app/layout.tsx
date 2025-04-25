'use client'

import { supabaseClient } from "@/libs/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Figtree } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <html lang="en">
      <body
        className={`${figtree.className} antialiased`}
      >
        {!!session ? (
          <Sidebar songs={[]}>
            {children}
          </Sidebar>
        ) : (
          <Auth
            supabaseClient={supabaseClient}
          />
        )}
      </body>
    </html>
  );
}
