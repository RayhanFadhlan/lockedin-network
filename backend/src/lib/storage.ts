import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const uploadsDir = 'uploads';


export const createFile = async (file: File): Promise<string> => {
  const uniqueName = `${randomUUID()}-${file.name}`;
  const filePath = path.join(uploadsDir, uniqueName);
  const fileBuffer = await file.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
  return filePath;
};

export const deleteFile = async (fileName: string): Promise<void> => {
  const filePath = fileName;
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
};