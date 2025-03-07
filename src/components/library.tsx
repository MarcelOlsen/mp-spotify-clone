import { ListMusicIcon } from "lucide-react";
import { MediaItem } from "./media-item";

type LibraryProps = {
  songs: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    imageUrl: string;
  }[]
}

export const Library = ({ songs }: LibraryProps) => {
  return (
    <div className="flex flex-col bg-neutral-900 rounded-lg">
      <div className="flex items-center justify-between px-3 pt-4">
        <div className="flex items-center gap-x-1 font-semibold text-neutral-400">
          <ListMusicIcon className="size-5" />
          <p className="">Your Library</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <MediaItem
            key={song.title}
            data={song}
            onClick={() => { }}
          />
        ))}
      </div>
    </div>
  );
};
