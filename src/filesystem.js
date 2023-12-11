import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const presetsFile = path.join(__dirname, 'folder-presets.json');

export const loadPresets = () => {
  try {
    return JSON.parse(fs.readFileSync(presetsFile, 'utf-8'));
  } catch (error) {
    return {};
  }
};

export const savePresets = (presets) => {
  fs.writeFileSync(presetsFile, JSON.stringify(presets, null, 2), 'utf-8');
  console.log(chalk.green('Presets updated successfully.'));
};

export const deletePreset = (presets, presetName) => {
  delete presets[presetName];
  savePresets(presets);
};

export const createFolders = (folderList) => {
  folderList.forEach(folderName => {
    const folderPath = path.join(process.cwd(), folderName);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(chalk.green(`Created folder: ${folderName}`));
    } else {
      console.log(chalk.yellow(`Folder already exists: ${folderName}`));
    }
  });
};
