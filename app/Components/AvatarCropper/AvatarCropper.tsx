"use client";
import Cropper from "react-easy-crop";
import { useState } from "react";

export default function AvatarCropper({ file, onDone }: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<any>(null);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 p-4 rounded-xl w-[320px] h-[380px] text-white space-y-4">

        <div className="relative w-full h-[250px] rounded-lg overflow-hidden">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, a) => setArea(a)}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={e => setZoom(+e.target.value)}
        />

        <button
          onClick={() => onDone(area)}
          className="w-full bg-cyan-700 rounded-lg py-2"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}
