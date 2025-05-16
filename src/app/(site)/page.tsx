'use client'

import { Header } from "@/components/header";
import { SongUploadModal } from "@/components/song-upload-modal";
import { useState } from "react";

const Home = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false)
  return (
    <div className="w-full">
      <Header>
        <SongUploadModal open={isUploadModalOpen} />
      </Header>
    </div>
  );
};

export default Home;
