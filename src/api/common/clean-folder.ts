import * as rimraf from 'rimraf';

export const cleanFolder = (folder: string): void => rimraf.sync(folder);
