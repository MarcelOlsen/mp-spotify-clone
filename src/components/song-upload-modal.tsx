"use client";

import {
    IMAGES_BUCKET,
    SONG_BUCKET,
    SONGS_TABLE,
} from "@/constants/supabaseConst";
import { supabaseClient } from "@/libs/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface SongUploadModalProps {
    open: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const uploadFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title must be at least 1 character long")
        .max(100),
    author: z
        .string()
        .min(1, "Author must be at least 1 character long")
        .max(100),
    songFile: z.instanceof(File, {
        message: "Please select a valid song file",
    }),
    imageFile: z.instanceof(File, {
        message: "Please select a valid image file",
    }),
    duration: z.string().min(1, "Duration must be at least 1 second").max(3600),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

export const SongUploadModal = ({ open, setIsOpen }: SongUploadModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<UploadFormValues>({
        resolver: zodResolver(uploadFormSchema),
    });

    // Watch file inputs to display selected filenames
    const songFile = watch("songFile");
    const imageFile = watch("imageFile");

    const onSubmit = async (data: UploadFormValues) => {
        setIsLoading(true);

        try {
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();

            if (!user)
                throw new Error("Only logged in users can upload a song!");

            const songAssetName = `${Date.now()}_${data.songFile.name}`;
            const imageAssetName = `${Date.now()}_${data.imageFile.name}`;

            // Upload song file
            const { error: songError } = await supabaseClient.storage
                .from(SONG_BUCKET)
                .upload(songAssetName, data.songFile);

            if (songError) throw songError;

            // Upload image file
            const { error: imageError } = await supabaseClient.storage
                .from(IMAGES_BUCKET)
                .upload(imageAssetName, data.imageFile);

            if (imageError) throw imageError;

            const newSong = {
                title: data.title,
                song_path: songAssetName,
                image_path: imageAssetName,
                author: data.author,
                duration: parseInt(data.duration),
            };

            const { error: tableError } = await supabaseClient
                .from(SONGS_TABLE)
                .insert(newSong);

            if (tableError) throw tableError;

            console.log("uploading song");

            // Reset form on success
            reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    // Handle file input changes
    const handleFileChange =
        (fieldName: "songFile" | "imageFile") =>
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setValue(fieldName, file);
            }
        };

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogContent className="bg-neutral-800 rounded-lg p-8 w-full max-w-md">
                <DialogTitle className="text-2xl font-bold mb-6 text-white">
                    Upload a Song
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-200 mb-2"
                            htmlFor="title"
                        >
                            Song Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            {...register("title")}
                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter song title"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-200 mb-2"
                            htmlFor="author"
                        >
                            Artist Name
                        </label>
                        <input
                            id="author"
                            type="text"
                            {...register("author")}
                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter artist name"
                        />
                        {errors.author && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.author.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-200 mb-2"
                            htmlFor="author"
                        >
                            Duration
                        </label>
                        <input
                            id="duration"
                            type="number"
                            {...register("duration")}
                            className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter duration"
                        />
                        {errors.duration && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.duration.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-200 mb-2"
                            htmlFor="songFile"
                        >
                            Song File
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="w-full flex flex-col items-center px-4 py-6 bg-neutral-700 text-white rounded-lg border border-neutral-600 cursor-pointer hover:bg-neutral-600 transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <span className="mt-2 text-sm">
                                    Select audio file
                                </span>
                                <input
                                    id="songFile"
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={handleFileChange("songFile")}
                                />
                            </label>
                        </div>
                        {songFile && (
                            <p className="mt-2 text-sm text-gray-400">
                                Selected: {songFile.name}
                            </p>
                        )}
                        {errors.songFile && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.songFile.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium text-gray-200 mb-2"
                            htmlFor="imageFile"
                        >
                            Cover Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="w-full flex flex-col items-center px-4 py-6 bg-neutral-700 text-white rounded-lg border border-neutral-600 cursor-pointer hover:bg-neutral-600 transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span className="mt-2 text-sm">
                                    Select cover image
                                </span>
                                <input
                                    id="imageFile"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange("imageFile")}
                                />
                            </label>
                        </div>
                        {imageFile && (
                            <p className="mt-2 text-sm text-gray-400">
                                Selected: {imageFile.name}
                            </p>
                        )}
                        {errors.imageFile && (
                            <p className="mt-1 text-sm text-red-400">
                                {errors.imageFile.message}
                            </p>
                        )}
                    </div>

                    <Button
                        onClick={() => console.log("submitted")}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Uploading..." : "Upload Song"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
