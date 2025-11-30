import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, '../data');

// Helper to read JSON files
export const readJSONFile = async (filename) => {
  try {
    const filePath = join(dataDir, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist or is empty
    return [];
  }
};

// Helper to write JSON files
export const writeJSONFile = async (filename, data) => {
  try {
    const filePath = join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    return false;
  }
};