import { resolve } from 'path';
import { createFileSync, writeFileSync } from 'fs-extra';
import { sync as gzipSize } from 'gzip-size';
import { runPlugins } from './run-plugins';
import { checksum } from './checksum';
import { OutputFile, ParsedOptions, PostBuild } from './types';

let lastEmittedFiles: OutputFile[] = [];

const hasChanged = (newFileName: string, newFileChecksum: string): boolean => {
  const previousOutputFile = lastEmittedFiles.find(({ name }) => newFileName === name);
  return !previousOutputFile || previousOutputFile.checksum !== newFileChecksum;
};

const emitFile = (folder: string, { name, content }: OutputFile): void => {
  const filePath = resolve(`${folder}/${name}`);
  createFileSync(filePath);
  writeFileSync(filePath, content);
};

export const addOutputFile = (
  name: string, content: string | Buffer, files: Record<string, OutputFile>,
): void => {
  const crc = checksum(content);
  // eslint-disable-next-line no-param-reassign
  files[name] = {
    name,
    content,
    changed: hasChanged(name, crc),
    checksum: crc,
    size: Buffer.byteLength(content, typeof content === 'string' ? 'utf-8' : undefined),
    gzip: gzipSize(content),
  };
};

export const removeOutputFile = (file: string, files: Record<string, OutputFile>): void => {
  // eslint-disable-next-line no-param-reassign
  delete files[file];
};

export const emit = async (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  await runPlugins(options.plugins, 'before-emit', options, builds);

  builds.forEach(({ outputFiles }) => {
    Object.keys(outputFiles).forEach((filename) => {
      if (hasChanged(outputFiles[filename].name, outputFiles[filename].checksum)) {
        emitFile(options.output, outputFiles[filename]);
      }
    });
  });

  await runPlugins(options.plugins, 'after-emit', options, builds);

  lastEmittedFiles = builds.reduce((accumulator, { outputFiles }) => ([
    ...accumulator,
    ...Object.values(outputFiles),
  ]), []);
};
