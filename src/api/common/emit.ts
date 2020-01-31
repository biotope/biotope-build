import { resolve, basename } from 'path';
import { createFileSync, writeFileSync } from 'fs-extra';
import { sync as gzipSize } from 'gzip-size';
import { runPlugins } from './run-plugins';
import { checksum } from './checksum';
import {
  OutputFile, ParsedOptions, PostBuild, OutputFileInfo,
} from './types';

let lastEmittedFiles: OutputFile[] = [];

const hasChanged = (newFileName: string, newFileChecksum: string): boolean => {
  const previousOutputFile = lastEmittedFiles.find(({ name }) => newFileName === name);
  return !previousOutputFile || previousOutputFile.checksum !== newFileChecksum;
};

export const getAddFileFunction = (
  config: ParsedOptions, files: Record<string, OutputFile>,
) => ({ name, content, mapping }: OutputFileInfo, override = false): void => {
  const crc = checksum(content);
  const changed = hasChanged(name, crc);
  const mapFileName = `${basename(name)}.map`;

  if (!override && !changed) {
    // eslint-disable-next-line no-param-reassign
    files[name].changed = false;

    if (files[mapFileName]) {
      // eslint-disable-next-line no-param-reassign
      files[mapFileName].changed = false;
    }
    return;
  }

  let contentEnding = '';
  if (mapping && config.maps && (config.maps.environment === process.env.NODE_ENV || config.maps.environment === 'all')) {
    if (config.maps.type === 'inline' || config.maps.type === 'file') {
      contentEnding = `\n//# sourceMappingURL=${config.maps.type === 'inline' ? mapping.toUrl() : mapFileName}`;
    }

    if (config.maps.type === 'hidden' || config.maps.type === 'file') {
      const mappingContent = mapping.toString();
      // eslint-disable-next-line no-param-reassign
      files[mapFileName] = {
        name: `${name}.map`,
        content: mappingContent,
        changed,
        checksum: crc,
        size: Buffer.byteLength(mappingContent, 'utf-8'),
        gzip: gzipSize(mappingContent),
      };
    }
  }

  // eslint-disable-next-line no-param-reassign
  files[name] = {
    name,
    content: !contentEnding || typeof content !== 'string' ? content : `${content}${contentEnding}`,
    changed,
    checksum: crc,
    size: Buffer.byteLength(content, typeof content === 'string' ? 'utf-8' : undefined),
    gzip: gzipSize(content),
  };
};

export const getRemoveFileFunction = (
  files: Record<string, OutputFile>,
) => ({ name, mapping }: OutputFileInfo): void => {
  const mapFileName = `${basename(name)}.map`;

  // eslint-disable-next-line no-param-reassign
  delete files[name];

  if (mapping) {
    // eslint-disable-next-line no-param-reassign
    delete files[mapFileName];
  }
};

export const emit = async (options: ParsedOptions, builds: PostBuild[]): Promise<void> => {
  await runPlugins(options.plugins, 'before-emit', options, builds);

  builds.forEach(({ outputFiles }) => {
    Object.keys(outputFiles).forEach((filename) => {
      if (outputFiles[filename].changed) {
        const filePath = resolve(`${options.output}/${outputFiles[filename].name}`);
        createFileSync(filePath);
        writeFileSync(filePath, outputFiles[filename].content);
      }
    });
  });

  await runPlugins(options.plugins, 'after-emit', options, builds);

  const uniqueFiles = builds.reduce((accumulator, { outputFiles }) => ({
    ...accumulator,
    ...outputFiles,
  }), {} as Record<string, OutputFile>);

  lastEmittedFiles = Object.keys(uniqueFiles).reduce((accumulator, file) => ([
    ...accumulator,
    uniqueFiles[file],
  ]), []);
};
