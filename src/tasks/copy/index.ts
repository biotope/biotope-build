import * as cpx from 'cpx';
import { BuildConfig } from './../../types';

export default async (buildConfig: BuildConfig, isServing: boolean) => {
  const copy = isServing ? cpx.watch : cpx.copy;
  const copies = buildConfig.copyFiles.map((fileGlob) => new Promise((res, rej) => {
    copy(fileGlob.src, buildConfig.paths.distFolder, (err) => {err ? rej(err) : res()})
  }));
  await Promise.all(copies);
}