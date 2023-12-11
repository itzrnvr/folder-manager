import inquirer from 'inquirer';
import gradient from 'gradient-string';

export const promptUserForPresetName = async (existingPresets) => {
  const { presetName } = await inquirer.prompt({
    type: 'input',
    name: 'presetName',
    message: 'Enter preset name:',
    validate: (input) => input.trim() !== '' && !existingPresets.includes(input) || 'Preset name cannot be empty or already exist.',
  });
  return presetName;
};

export const promptUserForFolders = async (defaultFolders = []) => {
  let folders = [...defaultFolders];

  const displayFolderList = () => {
    console.log('Folders:');
    if (folders.length === 0) {
      console.log('(none)');
    } else {
      folders.forEach((folder, index) => console.log(gradient.pastel(`${index + 1}. ${folder}`)));
    }
  };

  const addOrRemoveFolders = async () => {
    console.log('\nCurrent folders:');
    displayFolderList();

    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Add folders', 'Remove folders', 'Done editing'],
    });

    if (action === 'Add folders') {
      await addFolders(folders);
    } else if (action === 'Remove folders') {
      await removeFolders(folders);
    } else {
      return folders;
    }

    return addOrRemoveFolders(); // recurse to allow further add/remove actions
  };

  return addOrRemoveFolders();
};

export const addFolders = async (folders) => {
  const { newFolder } = await inquirer.prompt({
    type: 'input',
    name: 'newFolder',
    message: 'Enter folder name (leave empty and press Enter to finish):',
  });

  if (newFolder.trim() !== '') {
    if (!folders.includes(newFolder)) {
      folders.push(newFolder);
      console.log(`Added folder: ${gradient.pastel(newFolder)}`);
    } else {
      console.log(`Folder '${newFolder}' is already in the list.`);
    }
  }
};

export const removeFolders = async (folders) => {
  if (folders.length === 0) {
    console.log('No folders to remove.');
    return;
  }

  const choices = [...folders, new inquirer.Separator(), 'Cancel'];
  const { folderToDelete } = await inquirer.prompt({
    type: 'list',
    name: 'folderToDelete',
    message: 'Select the folder you would like to delete:',
    choices,
  });

  if (folderToDelete !== 'Cancel') {
    const index = folders.indexOf(folderToDelete);
    if (index > -1) {
      folders.splice(index, 1); // Remove the folder from the list
      console.log(`Deleted folder: ${gradient.pastel(folderToDelete)}`);
    }
  }
};

export const confirmOperation = async (message) => {
  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message,
    default: true,
  });
  return confirm;
};

export const selectPresetOrAction = async (presets) => {
  const choices = [
    ...Object.keys(presets),
    new inquirer.Separator(),
    'Add new preset',
    'Manage presets',
    'Exit',
  ];
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Select a preset to use, manage presets, or exit:',
    choices,
  });
  return action;
};

export const managePresetsMenu = async (presets) => {
  const choices = [
    'Edit a preset',
    'Delete a preset',
    'Back',
  ];
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Select an action:',
    choices,
  });
  return action;
};

export const selectPresetToManage = async (presets, action) => {
  const choices = [
    ...Object.keys(presets),
    new inquirer.Separator(),
    'Cancel',
  ];
  const { preset } = await inquirer.prompt({
    type: 'list',
    name: 'preset',
    message: `Select a preset to ${action}:`,
    choices,
  });
  return preset;
};
