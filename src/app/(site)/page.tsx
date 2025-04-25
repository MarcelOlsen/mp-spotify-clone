import { Header } from "@/components/header";
import { SongUploadModal } from "@/components/song-upload-modal";

const Home = () => {
  return (
    <div className="w-full">
      <Header>
        <SongUploadModal />
      </Header>
    </div>
  );
};

export default Home;
