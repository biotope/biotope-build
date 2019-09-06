import * as glob from 'glob';
import * as fs from 'fs';

export const createComponentJsonTo = (folder: string): Function => (): Promise<any> => new Promise((res, rej) => {
  glob('src/components/**/*.html', (err, files) => {
    if(err) {
      rej(err);
    }
    fs.writeFileSync(`${folder}/components.json`, JSON.stringify(files));
    res();
  });
});
