'use client'

import { Sidebar } from "@/components/sidebar";
import axios from "axios";
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
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const response = await axios.get("https://api.mockapi.com/api/songs", {
      headers: {
        "x-api-key": "728dbfe57c5e4086b06334a1c489e0bb"
      }
    })

    setSongs(response.data);
  }

  useEffect(() => {
    fetchSongs()
  }, [])

  return (
    <html lang="en">
      <body
        className={`${figtree.className} antialiased`}
      >
        <Sidebar songs={songs}>
          {children}
        </Sidebar>
      </body>
    </html>
  );
}
