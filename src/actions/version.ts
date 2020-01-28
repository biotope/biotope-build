import { requireJson } from '../api/common/require-json.js';
import { Action } from './types';

const { version } = requireJson('../../package.json');

export const registerVersion: Action = (program) => program.version(version as string);
