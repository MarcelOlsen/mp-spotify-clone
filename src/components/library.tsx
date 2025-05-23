"use client";

import { Song } from "@/types/song";
import { ListMusicIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { MediaItem } from "./media-item";
import { SongUploadModal } from "./song-upload-modal";

type LibraryProps = {
    songs: Song[];
};

export const Library = ({ songs }: LibraryProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <SongUploadModal open={isDialogOpen} setIsOpen={setIsDialogOpen} />
            <div className="flex flex-col bg-neutral-900 rounded-lg h-full">
                <div className="flex items-center justify-between px-3 pt-4">
                    <div className="flex items-center justify-between gap-x-1 font-semibold text-neutral-400 w-full">
                        <div className="flex items-center gap-2">
                            <ListMusicIcon className="size-5" />
                            <p className="">Your Library</p>
                        </div>
                        <div className="flex items-center">
                            <button onClick={() => setIsDialogOpen(true)}>
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-y-2 mt-4 px-3">
                    {songs.map((song) => (
                        <MediaItem
                            key={song.id}
                            data={song}
                            onClick={() => {}}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
