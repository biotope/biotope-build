import * as ejs from 'ejs';
import * as fs from 'fs';

type renderPreviewEjs = (_: string) => Promise<any>;

const previewPath = '/../../dev-preview/';

export const renderPreviewEjsTo = (folder: string, connect?): renderPreviewEjs => (
  templatePath: string,
): Promise<any> => new Promise((res, rej) => {
  ejs.renderFile(templatePath, {}, {
    root: `${__dirname}${previewPath}`
  }, (err, str) => {
    if(err) {
      rej(err);
    }
    fs.writeFileSync(`${folder}/index.html`, str);
    res();
  })
});
