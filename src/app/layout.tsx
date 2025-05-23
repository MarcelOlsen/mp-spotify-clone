"use client";

import { Sidebar } from "@/components/sidebar";
import { queryClient } from "@/libs/queryClient";
import { supabaseClient } from "@/libs/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Figtree } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";

const figtree = Figtree({
    variable: "--font-figtree",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <html lang="en">
            <body className={`${figtree.className} antialiased bg-black`}>
                {!session ? (
                    <Auth
                        supabaseClient={supabaseClient}
                        appearance={{ theme: ThemeSupa }}
                    />
                ) : (
                    <QueryClientProvider client={queryClient}>
                        <Sidebar>{children}</Sidebar>
                    </QueryClientProvider>
                )}
            </body>
        </html>
    );
}
