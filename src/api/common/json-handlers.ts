import { readFileSync } from 'fs-extra';
import * as commentJson from 'comment-json';

export const parseJson = <T>(content: string): T => commentJson.parse(content);

export const requireJson = <T>(file: string): T => parseJson(readFileSync(file).toString());

export const safeName = (name: string): string => name
  .replace(/[&#,+()$~%.'":*?<>{}\s\-/@\\0-9]/g, '_')
  .toLowerCase();
