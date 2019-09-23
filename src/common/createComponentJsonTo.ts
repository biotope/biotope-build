import * as glob from 'glob';
import * as fs from 'fs-extra';

export const createComponentJsonTo = (folder: string): Function => (): Promise<any> => new Promise((res, rej) => {
  glob('{src/components/**/*.html,src/components/**/scaffolding/*.hbs}', (err, files) => {
    if(err) {
      rej(err);
    }
    fs.outputFileSync(`${folder}/components.json`, JSON.stringify(files.map(f => f.replace('.hbs', '.html'))));
    res();
  });
});
