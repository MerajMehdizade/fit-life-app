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
