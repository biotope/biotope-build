import {copy} from 'cpx';

type MoveFiles = (_: string[] | string) => void;

export const copyFilesTo = (folder: string): MoveFiles => async (
  glob: string,
): Promise<any> => new Promise((res, rej) => {copy(glob, folder, (err) => {res()})});
