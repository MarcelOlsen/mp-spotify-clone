"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { supabaseClient } from "@/libs/supabaseClient";
import { Input } from "@/components/ui/input";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

    const {
        data: songs,
        isLoading,
        isError,
    } = useQuery({
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
        <div className="flex items-center justify-center text-white">
            <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {JSON.stringify(songs)}
        </div>
    );
};

export default SearchPage;
