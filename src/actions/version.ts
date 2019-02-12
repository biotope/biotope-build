import { version } from '../../package.json';
import { Action } from './types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const registerVersion: Action = program => program.version(version as string);
