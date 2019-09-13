import { createDistFolder } from './createDistFolder';
import { BuildConfig } from './../types';
import * as fs from  'fs';

describe('create dist folder task', () => {
  beforeEach(() => {
    if (fs.existsSync(`${process.cwd()}/test_stubs/dist`)){
      fs.rmdirSync(`${process.cwd()}/test_stubs/dist`)
    }
  })
  it('does create dist folder from config', async () => {
    const config = {
      paths: {
        distFolder: `${process.cwd()}/test_stubs/dist`
      }
    } as BuildConfig;

    await createDistFolder(config);

    expect(fs.existsSync(`${process.cwd()}/test_stubs/dist`)).toBeTruthy();
  });
});