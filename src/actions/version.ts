import { version } from '../../package.json';
import { Action } from './types';

export const registerVersion: Action = (program) => program.version(version as string);
