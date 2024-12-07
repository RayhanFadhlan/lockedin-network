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
export const deleteFile = async (fileURL: string): Promise<void> => {
  // Extract the file path from the URL
  const filePath = fileURL.replace(baseURL, '').replace(/^\//, '');
  const fullPath = path.join(process.cwd(), uploadsDir, filePath);
  // console.log('Deleting file:', fullPath);
  // console.log('File exists:', fs.existsSync);
  // console.log("file path" , filePath);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
};