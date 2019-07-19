import * as rimraf from 'rimraf';

import { GulpTaskPromise } from '../../types';

export const removeFolder = (folder: string): GulpTaskPromise => (): Promise<void> => new Promise(
  (resolve, reject): void => rimraf(folder, (error): void => (!error ? resolve() : reject())),
);
