import { resolve } from 'path';

export const projectPath = resolve(process.cwd());

export const biotopeBuildPath = resolve(`${__dirname}/../../..`);

export const biotopeLibPath = resolve(`${biotopeBuildPath}/lib`);
