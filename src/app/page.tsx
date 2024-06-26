"use client";

import React from "react";
import FileUpload from "@/components/file-upload";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Image
          src="/visax-edASuS0pSHU-unsplash.jpg"
          alt="background image"
          fill
          priority
          className="blur-[64px] contrast-150 bg-contain bg-center bg-no-repeat"
        />
      <div className="relative w-screen max-w-lg flex justify-center items-center">
        <div className="relative w-full p-8 bg-black rounded-3xl shadow-lg">
          <h1 className="text-4xl font-normal m-auto pb-8 text-center text-white">
            Upload an image
          </h1>
          <div className="mb-4">
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
