import { requireJson } from '../api/common/json-handlers';
import { Action } from './types';

const { version } = requireJson('../../package.json');

export const registerVersion: Action = (program) => program.version(version as string);
