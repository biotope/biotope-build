import { BuildConfig } from './../types';
import { clean } from './clean';
import * as fs from  'fs';

describe('clean task', () => {
  beforeEach(() => {
    fs.mkdirSync(`${process.cwd()}/test_stubs/dist`);
  })
  afterEach(() => {
    if (fs.existsSync(`${process.cwd()}/test_stubs/dist`)){
      fs.rmdirSync(`${process.cwd()}/test_stubs/dist`)
    }
  })
  it('does remove dist folder from config', async () => {
    const config = {
      paths: {
        distFolder: `${process.cwd()}/test_stubs/dist`
      }
    } as BuildConfig;

    await clean(config, false);

    expect(fs.existsSync(`${process.cwd()}/test_stubs/dist`)).toBeFalsy();
  });
});