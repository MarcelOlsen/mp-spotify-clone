"use client";

import { Song } from "@/types/song";
import { supabaseClient } from "@/libs/supabaseClient";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
} from "lucide-react";
import Image from "next/image";

interface PlayerProps {
  currentSong?: Song;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const Player = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: PlayerProps) => {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const getImageUrl = (path: string) => {
    const { data } = supabaseClient.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  const getSongUrl = (path: string) => {
    const { data } = supabaseClient.storage.from("songs").getPublicUrl(path);
    return data.publicUrl;
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 p-4">
      <audio
        ref={audioRef}
        src={getSongUrl(currentSong.song_path)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      <div className="flex items-center justify-between">
        {/* Current Song Info */}
        <div className="flex items-center gap-3 min-w-0 w-1/4">
          <div className="relative h-14 w-14 flex-shrink-0">
            <Image
              src={getImageUrl(currentSong.image_path)}
              alt={currentSong.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {currentSong.title}
            </p>
            <p className="text-neutral-400 text-xs truncate">
              {currentSong.author}
            </p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="text-neutral-400 hover:text-white ml-2 flex-shrink-0"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-green-500 text-green-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 w-1/2 max-w-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`text-neutral-400 hover:text-white ${
                isShuffled ? "text-green-500" : ""
              }`}
            >
              <Shuffle className="h-4 w-4" />
            </button>

            <button
              onClick={onPrevious}
              className="text-neutral-400 hover:text-white"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-1" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-neutral-400 hover:text-white"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            <button
              onClick={() =>
                setRepeatMode(
                  repeatMode === "off"
                    ? "all"
                    : repeatMode === "all"
                    ? "one"
                    : "off"
                )
              }
              className={`text-neutral-400 hover:text-white ${
                repeatMode !== "off" ? "text-green-500" : ""
              }`}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === "one" && (
                <span className="absolute -mt-1 -ml-2 text-xs">1</span>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-neutral-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-neutral-600 rounded-full cursor-pointer group"
            >
              <div
                className="h-full bg-white rounded-full relative group-hover:bg-green-500"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-neutral-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 justify-end w-1/4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-neutral-400 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <div className="w-24 h-1 bg-neutral-600 rounded-full cursor-pointer group">
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-green-500"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseInt(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0) setIsMuted(false);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
