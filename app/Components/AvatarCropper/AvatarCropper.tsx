"use client";
import Cropper from "react-easy-crop";
import { useEffect, useState } from "react";

interface Props {
  file: File;
  onConfirm: (area: any) => void;
  onCancel: () => void;
}

export default function AvatarCropper({ file, onConfirm, onCancel }: Props) {
  const [src, setSrc] = useState<string>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<any>();

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-gray-950 rounded-xl p-4 w-96">
        <h2 className="text-white mb-2 text-lg">ویرایش آواتار</h2>

        <div className="relative h-72 rounded overflow-hidden">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, a) => setArea(a)}
            />
          )}
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(+e.target.value)}
          className="w-full mt-3"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-700 rounded">لغو</button>
          <button onClick={() => onConfirm(area)} className="px-3 py-1 bg-cyan-800 rounded">ذخیره</button>
        </div>
      </div>
    </div>
  );
}
