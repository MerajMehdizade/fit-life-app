"use client";

import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
export async function cropImage(src: string, area: any) {
  const img = document.createElement("img");
  img.src = src;
  await new Promise(r => (img.onload = r));

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    img,
    area.x, area.y, area.width, area.height,
    0, 0, area.width, area.height
  );

  return new Promise<Blob>(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.9));
}


interface AvatarCropperProps {
  file: File;
  onDone: (area: any) => void;
  onCancel: () => void;
}

export default function AvatarCropper({ file, onDone, onCancel }: AvatarCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result as string);
  }, [file]);

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await cropImage(URL.createObjectURL(file), croppedAreaPixels);
    onDone(blob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-xl p-4 w-11/12 max-w-md flex flex-col items-center">
        <h2 className="text-white text-xl mb-2">تغییر آواتار</h2>
        <div className="relative w-full h-64 bg-gray-700 rounded-lg overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <div className="w-full mt-3 flex items-center gap-3">
          <label className="flex-1 text-white">
            زوم:
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full mt-1"
            />
          </label>
        </div>
        <div className="mt-4 flex gap-3 w-full justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
          >
            لغو
          </button>
          <button
            onClick={handleDone}
            className="px-4 py-2 rounded-lg bg-cyan-900 hover:bg-cyan-800 text-white transition"
          >
            ذخیره
          </button>
        </div>
      </div>
    </div>
  );
}
