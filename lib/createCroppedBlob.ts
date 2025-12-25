export async function createCroppedBlob(file: File, area: any): Promise<Blob> {
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.src = url;
  await new Promise(r => (img.onload = r));

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height
  );

  URL.revokeObjectURL(url);

  return new Promise(res =>
    canvas.toBlob(b => res(b!), "image/webp", 0.95)
  );
}
