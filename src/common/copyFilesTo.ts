import {copy} from 'cpx';

type MoveFiles = (_: string[] | string) => void;

export const copyFilesTo = (folder: string): MoveFiles => (
  glob: string,
): Promise<any> => copy(glob, folder);
