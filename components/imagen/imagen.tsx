"use client";

import { motion } from "framer-motion";
import { ImageIcon, Download, Sparkles, Camera, Copy } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ImageData {
  url: string;
  prompt: string;
}

interface ImagegenData {
  success?: boolean;
  images?: ImageData[];
  error?: string;
}

interface ImagegenProps {
  imagegenData?: ImagegenData;
  isLoading?: boolean;
}

export const Imagen = ({ imagegenData, isLoading }: ImagegenProps) => {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Download the image
  const handleDownload = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `imagen-${Date.now()}-${index}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded successfully");
  };

  // Copy the image to clipboard
  const handleCopy = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast.success("Image copied to clipboard");
    } catch (error) {
      console.error("Failed to copy image:", error);
      toast.error("Failed to copy image to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 border border-blue-200 dark:border-blue-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <ImageIcon size={22} className="text-blue-500" />
            <motion.div 
              className="absolute -top-1 -right-1 size-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <h3 className="font-medium text-blue-700 dark:text-blue-400">Generating Images</h3>
        </div>
        
        <motion.div 
          className="w-full aspect-square bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-lg flex items-center justify-center mb-5"
          animate={{ 
            background: ["linear-gradient(to right, #eef2ff, #eff6ff)", "linear-gradient(to right, #eff6ff, #eef2ff)"] 
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
          >
            <Sparkles size={40} className="text-blue-300 dark:text-blue-700" />
          </motion.div>
        </motion.div>
        
        <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ width: ["0%", "40%", "60%", "75%", "85%"] }}
            transition={{ duration: 8, ease: "easeInOut", times: [0, 0.2, 0.4, 0.6, 1] }}
          />
        </div>
        
        <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Creating with Google&apos;s Imagen 3 model...
        </div>
      </div>
    );
  }

  if (!imagegenData || imagegenData.error) {
    return (
      <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-5 text-red-800 dark:text-red-200">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={18} className="text-red-500" />
          <h3 className="font-medium">Image Generation Failed</h3>
        </div>
        <p className="mt-2">{imagegenData?.error || "Failed to generate images. Please try again."}</p>
      </div>
    );
  }

  if (!imagegenData.images || imagegenData.images.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={18} className="text-zinc-500" />
          <h3 className="font-medium">No Images Generated</h3>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 ml-0.5 mt-2">No images were returned. Try a different prompt.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all overflow-hidden border border-zinc-200 dark:border-zinc-700"
      >
        {/* Header with tool label */}
        <div className="mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-blue-500" />
          <h3 className="font-medium text-blue-700 dark:text-blue-400">Image Generation</h3>
        </div>
        
        {/* Main display of the selected image */}
        <div className="mb-4">
          <div className="relative aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden mb-3 shadow-sm">
            <Image
              src={imagegenData.images[selectedImageIndex].url}
              alt={`Generated image ${selectedImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 px-4 py-2 bg-gradient-to-t from-zinc-900/80 to-transparent">
              <div className="flex justify-between items-center">
                <div className="text-xs text-white">Image {selectedImageIndex + 1} of {imagegenData.images.length}</div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => handleCopy(imagegenData.images[selectedImageIndex].url)}
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => handleDownload(imagegenData.images[selectedImageIndex].url, selectedImageIndex)}
                  >
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thumbnail gallery */}
        {imagegenData.images.length > 1 && (
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2">
              {imagegenData.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all ${
                    index === selectedImageIndex
                      ? "ring-2 ring-blue-500 dark:ring-blue-400"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Prompt display */}
        <div className="mt-3 p-3 bg-zinc-200/80 dark:bg-zinc-700/30 rounded-md">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Prompt</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            {imagegenData.images[0].prompt}
          </div>
        </div>
        
        {/* Image aspect ratio selector for future generations */}
        <div className="mt-4">
          <Label htmlFor="aspect-ratio" className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5 block">
            Aspect Ratio (for next generation)
          </Label>
          <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
            <SelectTrigger id="aspect-ratio" className="w-full">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">Square (1:1)</SelectItem>
              <SelectItem value="4:3">Landscape (4:3)</SelectItem>
              <SelectItem value="3:4">Portrait (3:4)</SelectItem>
              <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
              <SelectItem value="9:16">Mobile (9:16)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 mb-2">
            <Camera size={14} />
            <span>Powered by Google&apos;s Imagen 3.0 generative image model</span>
          </div>
          <p>Images are generated with SynthID watermarking technology.</p>
        </div>
      </motion.div>
    </div>
  );
}; 