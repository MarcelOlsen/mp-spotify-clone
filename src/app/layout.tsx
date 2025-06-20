"use client";

import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";
import { queryClient } from "@/libs/queryClient";
import { supabaseClient } from "@/libs/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Figtree } from "next/font/google";
import { useEffect, useState } from "react";
import { Song } from "@/types/song";
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
  const [currentSong, setCurrentSong] = useState<Song | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist[prevIndex]);
    }
  };

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
            <div className="flex flex-col h-screen">
              <div className="flex-1 overflow-hidden">
                <Sidebar>{children}</Sidebar>
              </div>
              <Player
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          </QueryClientProvider>
        )}
      </body>
    </html>
  );
}
