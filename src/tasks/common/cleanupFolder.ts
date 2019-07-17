import * as rimraf from 'rimraf';

const cleanupFolder = (folder: string) => () => new Promise(res => rimraf(folder, res));

export default cleanupFolder;