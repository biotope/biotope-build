import { resolve } from 'path';
import { readFileSync } from 'fs-extra';

const requireFolder = resolve(`${__dirname}/../../`);
const path = `${requireFolder}/require.js`;
const pathMin = `${requireFolder}/require.min.js`;

export const getContent = (minified = false): string => {
  const file = minified ? pathMin : path;
  try {
    return readFileSync(file).toString();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`File "${file}" cannot be read.`);
    throw error;
  }
};
