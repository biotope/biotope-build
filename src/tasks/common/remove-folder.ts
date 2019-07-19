import * as rimraf from 'rimraf';

export const removeFolder = (folder: string) => () => new Promise(resolve => rimraf(folder, resolve));
