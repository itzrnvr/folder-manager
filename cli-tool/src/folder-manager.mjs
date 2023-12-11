// #!/usr/bin/env node

import {
    promptUserForPresetName,
    confirmOperation,
    promptUserForFolders,
    selectPresetOrAction,
    managePresetsMenu,
    selectPresetToManage,
  } from './prompts.mjs';
  import { loadPresets, savePresets, createFolders, deletePreset } from '../../src/filesystem.js';
  import { animateText } from './animations.mjs';
  
  const main = async () => {
    const stopAnimation = animateText('Welcome to Folder Manager');
    setTimeout(async () => {
      stopAnimation();
      let running = true;
      while (running) {
        const presets = loadPresets();
        const action = await selectPresetOrAction(presets);
        if (presets.hasOwnProperty(action)) {
          createFolders(presets[action]);
          running = false; // Immediately execute the selected preset and exit
        } else if (action === 'Add new preset') {
          const presetName = await promptUserForPresetName(Object.keys(presets));
          const folders = await promptUserForFolders();
          presets[presetName] = folders;
          savePresets(presets);
        } else if (action === 'Manage presets') {
          const manageAction = await managePresetsMenu(presets);
          if (manageAction !== 'Back') {
            const presetToManage = await selectPresetToManage(presets, manageAction);
            if (presetToManage !== 'Cancel') {
              if (manageAction === 'Edit a preset') {
                const folders = await promptUserForFolders(presets[presetToManage]);
                presets[presetToManage] = folders;
                savePresets(presets);
              } else if (manageAction === 'Delete a preset') {
                if (await confirmOperation(`Are you sure you want to delete the preset '${presetToManage}'?`)) {
                  deletePreset(presets, presetToManage);
                }
              }
            }
          }
        } else if (action === 'Exit') {
          running = false;
        }
      }
    }, 500);
  };
  
  main();


