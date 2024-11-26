import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const uploadsDir = 'uploads';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';
const baseURL = `http://${host}:${port}`;


export const createFile = async (file: File): Promise<string> => {
  const uniqueName = `${randomUUID()}-${file.name}`;
  const filePath = path.join(uploadsDir, uniqueName);
  const fileBuffer = await file.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
  const fileURL = `${baseURL}/${filePath.replace(/\\/g, '/')}`;
  return fileURL;
};
export const deleteFile = async (fileName: string): Promise<void> => {
  const filePath = fileName;
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
};