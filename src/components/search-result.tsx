import Image from "next/image";
import { Song } from "@/types/song";

export const SearchResult = ({ song }: { song: Song }) => {
    return (
        <div className="flex justify-between w-full">
            <Image
                src={"/images/placeholder.jpg"}
                alt={song.title}
                width={50}
                height={50}
            />
            <div className="flex flex-col">
                <p className="text-sm font-semibold">{song.title}</p>
                <p className="text-sm text-gray-500">{song.author}</p>
            </div>
            <div className="flex">
                <p>{song.id}</p>
            </div>
            <div className="flex flex-col">
                <p className="text-sm">
                    {song.duration ? song.duration : "Unknown"}
                </p>
            </div>
        </div>
    );
};
