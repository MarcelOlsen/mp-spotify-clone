import Image from "next/image";

type MediaItemProps = {
  data: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    imageUrl: string;
  };
  onClick: () => void;
}

export const MediaItem = ({ data, onClick }: MediaItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-lg overflow-auto"
    >
      <div className="min-w-[50px] min-h-[50px]">
        <Image
          src={"/images/placeholder.jpg"}
          alt={data.title}
          className="object-cover"
          width={50}
          height={50}
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden">
        <p className="text-white truncate">{data.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data.artist}</p>
      </div>
    </div>
  )
}
