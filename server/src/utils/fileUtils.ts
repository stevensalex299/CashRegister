import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the content of a file.
 * @param filePath - The path to the file to read.
 * @returns The content of the file as a string.
 * @throws Error if the file cannot be read.
 */
export function readFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Error reading file at ${filePath}: ${error.message}`);
  }
}

/**
 * Writes content to a file.
 * @param filePath - The path to the file where the content should be written.
 * @param content - The content to write to the file.
 * @returns void
 * @throws Error if the file cannot be written.
 */
export function writeFileContent(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Error writing to file at ${filePath}: ${error.message}`);
  }
}

/**
 * Deletes a file.
 * @param filePath - The path to the file to delete.
 * @returns void
 * @throws Error if the file cannot be deleted.
 */
export function deleteFile(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    throw new Error(`Error deleting file at ${filePath}: ${error.message}`);
  }
}

/**
 * Gets the full path to a file given its filename.
 * @param filename - The name of the file.
 * @returns The full path to the file.
 */
export function getFilePath(fileName: string): string {
  return path.join(__dirname, '../../../uploads', fileName);
}
