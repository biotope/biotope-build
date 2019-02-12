import { resolve } from 'path';

export const projectPath = resolve(process.cwd());

export const biotopeBuildPath = resolve(`${projectPath}/node_modules/@biotope/build`);

export const biotopeLibPath = resolve(`${biotopeBuildPath}/lib`);
