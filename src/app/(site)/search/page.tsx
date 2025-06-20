"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { supabaseClient } from "@/libs/supabaseClient";
import { Input } from "@/components/ui/input";
import { SearchResult } from "@/components/search-result";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const { data: songs } = useQuery({
        queryKey: ["search", debouncedSearchQuery],
        queryFn: async () => {
            const { data: songs } = await supabaseClient
                .from("songs")
                .select("*")
                .ilike("title", `%${debouncedSearchQuery}%`);
            return songs;
        },
    });

    return (
        <div className="flex flex-col items-center justify-center gap-6 text-white">
            <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/2"
            />
            {songs?.map((song) => <SearchResult key={song.id} song={song} />)}
        </div>
    );
};

export default SearchPage;
