import { resolve, basename } from 'path';
import { createFileSync, writeFileSync } from 'fs-extra';
import { sync as gzipSize } from 'gzip-size';
import { runPlugins } from './run-plugins';
import { checksum } from './checksum';
import {
  OutputFile, ParsedOptions, PostBuild, OutputFileInfo, MapOptions,
} from './types';

const generateRandomId = (length = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return [...Array(length)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

const isCorrectEnvironment = ({ maps, production }: ParsedOptions): boolean => (maps as MapOptions).environment === 'all'
  || (production && (maps as MapOptions).environment === 'production')
  || (!production && (maps as MapOptions).environment === 'development');

let buildId = generateRandomId();

const setOutputFile = (
  files: Record<string, OutputFile>, name: string, values: Partial<OutputFile>,
): void => {
  if (!files[name]) {
    // eslint-disable-next-line no-param-reassign
    files[name] = { name } as OutputFile;
  }

  Object.keys(values).forEach((key: keyof OutputFile) => {
    // eslint-disable-next-line no-param-reassign,@typescript-eslint/no-explicit-any
    (files[name] as any)[key] = values[key];
  });
};

export const getAddFileFunction = (
  config: ParsedOptions, files: Record<string, OutputFile>,
) => ({ name, content, mapping }: OutputFileInfo): void => {
  const mapName = `${name}.map`;
  const isUpdate = (files[name] || {}).buildId === buildId;

  const crc = checksum(content);
  const previousCrc = (files[name] || {})[!isUpdate ? 'checksum' : 'previousChecksum'];
  const changed = crc !== previousCrc;

  let contentEnding = '';
  if (mapping && config.maps && isCorrectEnvironment(config)) {
    if (config.maps.type === 'inline' || config.maps.type === 'file') {
      contentEnding = `\n//# sourceMappingURL=${
        config.maps.type === 'inline' ? mapping.toUrl() : basename(mapName)
      }`;
    }

    if (config.maps.type === 'hidden' || config.maps.type === 'file') {
      const mappingContent = mapping.toString();
      setOutputFile(files, mapName, {
        content: mappingContent,
        checksum: crc,
        changed,
        size: Buffer.byteLength(mappingContent, 'utf-8'),
        gzip: gzipSize(mappingContent),
        buildId,
        previousChecksum: previousCrc,
      });
    }
  }

  setOutputFile(files, name, {
    content: !contentEnding || typeof content !== 'string' ? content : `${content}${contentEnding}`,
    checksum: crc,
    changed,
    size: Buffer.byteLength(content, typeof content === 'string' ? 'utf-8' : undefined),
    gzip: gzipSize(content),
    buildId,
    previousChecksum: previousCrc,
  });
};

const removeFromObject = <T>(key: string, object: Record<string, T>): Record<string, T> => {
  // eslint-disable-next-line no-param-reassign
  delete object[key];
  return object;
};

export const getRemoveFileFunction = (
  files: Record<string, OutputFile>,
) => (file: string | OutputFileInfo): void => {
  const name = typeof file === 'string' ? file : file.name;
  const mapName = `${name}.map`;
  if (files[mapName]) {
    removeFromObject(mapName, files);
  }
  removeFromObject(name, files);
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

  buildId = generateRandomId();
};
