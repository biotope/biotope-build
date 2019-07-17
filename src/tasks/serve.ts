import { src, dest, watch } from 'gulp';
import * as rimraf from 'rimraf';
import * as connect from 'gulp-connect';
import { ServeConfig } from '../config';
import * as fileList from 'gulp-filelist';

const createPreviewPath = (path: string) => `${__dirname}/../preview/${path}`;
const cleanup = (folder: string) => () => new Promise(res => rimraf(folder, res));
const createComponentJsonTo = (folder: string) => () => src('src/components/**/*.html').pipe(fileList('components.json')).pipe(dest(folder));
const moveFilesTo = (folder: string) => (globs: string[]) => src(globs).pipe(dest(folder)).pipe(connect.reload());

const copyWatchTo = (folder: string) => (globs: string[]) => {
  const moveFilesToTmp = moveFilesTo(folder);
  moveFilesToTmp(globs);
  watch(globs).on('change', moveFilesToTmp);
} 

const createServeTask = (config: ServeConfig) => () => new Promise(async (res, rej) => {
  const cleanupTmp = cleanup(config.tempFolder);
  const createComponentJsonToTmp = createComponentJsonTo(config.tempFolder);
  const copyWatchToTmp = copyWatchTo(config.tempFolder);
  await cleanupTmp();
  await createComponentJsonToTmp();
  const previewFiles = [
    createPreviewPath('*.html'),
    createPreviewPath('*.js'),
    createPreviewPath('*.html'),
  ];
  copyWatchToTmp(previewFiles)
  
  connect.server({    
    root: config.tempFolder,
    livereload: true,
    port: config.port,
  }, function () { this.server.on('close', res) })
})

export default createServeTask;