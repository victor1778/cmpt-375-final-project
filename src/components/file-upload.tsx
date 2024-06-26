/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import FileUploader from "./file-uploaded";
import Spinner from "./spinner";
import { motion } from "framer-motion";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [updatedImage, setUpdatedImage] = useState<boolean | null>(null);
    const [blur, setBlur] = useState(0);
    const [downloading, setDownloading] = useState<boolean | null>(null);
    const [uploading, setUploading] = useState<boolean | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: any) => {
            const file = acceptedFiles[0] ?? null;
            setFile(file);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                setUploading(true);
                await handleUpload(file);
            } else {
                setPreviewUrl(null);
            }
        },
        [previewUrl]
    );

    const getSignedUrl = async () => {
        const response = await fetch("/api/signed");
        if (!response.ok) {
            console.error("Failed to get signed URL.");
            throw new Error("Failed to get signed URL.");
        }
        return await response.json();
    };

    const upload = async (file: File, url: string, fields: any): Promise<File> => {
        const formData = new FormData();
        formData.append("filepond", file);
        formData.append("url", url);
        formData.append("fields", JSON.stringify(fields));

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("Failed to upload file.");
            throw new Error("Failed to upload file.");
        }

        const data = await response.json();
        const imageUrl = data["url"];

        return new File([file], imageUrl);
    };

    const handleUpload = async (file: File) => {
        try {
            const signedUrlData = await getSignedUrl();
            const newFile = await upload(file, signedUrlData["url"], signedUrlData["fields"]);
            setFile(newFile);
            setUpdatedImage(true);
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const downloadFile = async (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const fetchImage = async (url: string): Promise<Blob> => {
        const response = await fetch(`api/images/?url=${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "image/jpeg",
            },
        });
        return await response.blob();
    };

    const downloadBlurImage = async () => {
        if (!file) {
            console.error("No file selected.");
            return;
        }
        setDownloading(true);
        const fileKey = file.name.split("/").pop();
        const formData = new FormData();
        formData.append("key", fileKey as string);
        formData.append("blur_radius", blur.toString());

        const response = await fetch("/api/blur", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("Failed to upload file.");
            console.log(response);
            throw new Error("Failed to upload file.");
        }

        const data = await response.json();
        const imageUrl = data["url"];

        const imageBlob = await fetchImage(imageUrl);
        const newFile = new File([imageBlob], fileKey!, { type: "image/jpeg" });

        await downloadFile(newFile);
        setDownloading(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    return (
        <div className="flex flex-col gap-4">
            {uploading && (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            )}
            {!uploading && updatedImage && file ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <FileUploader file={file} handleBlurChanges={setBlur} />
                    <button className="w-full px-4 py-2 bg-white text-black font-medium rounded-3xl" onClick={downloadBlurImage}>
                        {downloading ? "Downloading..." : "Download"}
                    </button>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-4">
                    {previewUrl && file ? (
                        <div className="border-none relative m-auto max-w-full max-h-full rounded-3xl">

                        </div>
                    ) : (
                        <div
                            className={`text-center border border-dashed rounded-3xl p-20 hover:scale-105 transition-transform delay-100 duration-300 ease-in-out text-white ${
                                isDragActive ? "scale-105 border-green-200 transition-colors" : ""
                            }`}
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? <p>Drop file here ...</p> : <p>Drag and drop, or click to select a file</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
