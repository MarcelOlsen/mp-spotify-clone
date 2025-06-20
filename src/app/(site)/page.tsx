"use client";

import { supabaseClient } from "@/libs/supabaseClient";
import { Song } from "@/types/song";
import { useQuery } from "@tanstack/react-query";
import { Play, MoreHorizontal } from "lucide-react";
import Image from "next/image";

const Home = () => {
  const { data: songs = [], isPending } = useQuery({
    queryKey: ["songs"],
    queryFn: async () => {
      const req = await supabaseClient.from("songs").select();
      return req.data as Song[];
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      return user;
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getImageUrl = (path: string) => {
    const { data } = supabaseClient.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  if (isPending) {
    return (
      <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-lg overflow-hidden overflow-y-auto h-full">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-neutral-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recentlyPlayedSongs = songs.slice(0, 6);
  const recommendedSongs = songs.slice(6, 12);

  return (
    <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-lg overflow-hidden overflow-y-auto h-full">
      <div className="p-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}
            {user?.user_metadata?.full_name &&
              `, ${user.user_metadata.full_name}`}
          </h1>
        </div>

        {/* Recently Played Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyPlayedSongs.map((song) => (
              <div
                key={song.id}
                className="bg-neutral-800/50 rounded-md flex items-center gap-4 hover:bg-neutral-700/50 transition-all cursor-pointer group"
              >
                <div className="relative min-h-20 min-w-20">
                  <Image
                    src={getImageUrl(song.image_path)}
                    alt={song.title}
                    fill
                    className="object-cover rounded-l-md"
                  />
                </div>
                <div className="flex-1 truncate py-4 pr-4">
                  <p className="text-white font-semibold truncate">
                    {song.title}
                  </p>
                  <p className="text-neutral-400 text-sm truncate">
                    {song.author}
                  </p>
                </div>
                <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-green-500 rounded-full p-3 hover:bg-green-400 transition">
                    <Play className="h-4 w-4 text-black fill-black ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Made for You Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Made for you</h2>
            <button className="text-neutral-400 hover:text-white text-sm font-semibold">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendedSongs.map((song) => (
              <div
                key={song.id}
                className="bg-neutral-900/40 p-4 rounded-lg hover:bg-neutral-800/60 transition-all cursor-pointer group"
              >
                <div className="relative aspect-square mb-4">
                  <Image
                    src={getImageUrl(song.image_path)}
                    alt={song.title}
                    fill
                    className="object-cover rounded-md shadow-lg"
                  />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button className="bg-green-500 rounded-full p-3 hover:bg-green-400 transition">
                      <Play className="h-4 w-4 text-black fill-black ml-1" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold truncate mb-1">
                    {song.title}
                  </h3>
                  <p className="text-neutral-400 text-sm truncate">
                    {song.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Recently added</h2>
            <button className="text-neutral-400 hover:text-white text-sm font-semibold">
              Show all
            </button>
          </div>
          <div className="bg-neutral-900/40 rounded-lg p-4">
            <div className="grid grid-cols-12 gap-4 text-neutral-400 text-sm font-medium border-b border-neutral-800 pb-3 mb-3">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-1"></div>
            </div>
            {songs.slice(0, 5).map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-12 gap-4 items-center py-2 hover:bg-neutral-800/50 rounded group cursor-pointer"
              >
                <div className="col-span-1 text-neutral-400 text-sm">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="h-4 w-4 hidden group-hover:block" />
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="relative h-10 w-10">
                    <Image
                      src={getImageUrl(song.image_path)}
                      alt={song.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium truncate">
                      {song.title}
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p className="text-neutral-400 truncate">{song.author}</p>
                </div>
                <div className="col-span-2 text-neutral-400 text-sm">
                  {formatDuration(song.duration)}
                </div>
                <div className="col-span-1">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4 text-neutral-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Artists */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Popular artists</h2>
            <button className="text-neutral-400 hover:text-white text-sm font-semibold">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...new Set(songs.map((song) => song.author))]
              .slice(0, 6)
              .map((artist, index) => {
                const artistSong = songs.find((song) => song.author === artist);
                return (
                  <div
                    key={index}
                    className="bg-neutral-900/40 p-4 rounded-lg hover:bg-neutral-800/60 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-square mb-4">
                      <Image
                        src={
                          artistSong
                            ? getImageUrl(artistSong.image_path)
                            : "/placeholder.jpg"
                        }
                        alt={artist}
                        fill
                        className="object-cover rounded-full shadow-lg"
                      />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button className="bg-green-500 rounded-full p-3 hover:bg-green-400 transition">
                          <Play className="h-4 w-4 text-black fill-black ml-1" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold truncate mb-1">
                        {artist}
                      </h3>
                      <p className="text-neutral-400 text-sm">Artist</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
