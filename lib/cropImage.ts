export async function cropImage(fileOrUrl: File | string, area: any): Promise<Blob> {
  let imageSrc: string;

  if (typeof fileOrUrl === "string") {
    imageSrc = fileOrUrl;
  } else {
    imageSrc = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileOrUrl);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  }

  const img = document.createElement("img");
  img.src = imageSrc;
  await new Promise<void>((r) => (img.onload = () => r()));

  const canvas = document.createElement("canvas");
  canvas.width = area.width;
  canvas.height = area.height;
  const ctx = canvas.getContext("2d")!;
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

  return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.9));
}
