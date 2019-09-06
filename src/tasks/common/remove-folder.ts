import * as rimraf from 'rimraf';

export const removeFolder = (folder: string) => new Promise(
  (resolve, reject): void => rimraf(folder, (error): void => (!error ? resolve() : reject())),
);
