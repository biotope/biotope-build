import createStylesTask from "./sass";
import * as chai from 'chai';
import * as rimraf from 'rimraf';

chai.use(require('chai-fs'));
const expect = chai.expect;

describe('style task', () => {
  afterEach(() => {
    rimraf(`${process.cwd()}/test_stubs/dist`, () => {});
  });

  const config = {
    entryGlob: `${process.cwd()}/test_stubs/src/sass/**/*.scss`,
    target: `${process.cwd()}/test_stubs/dist/styles`,
    supportLegacy: true
  };
  const styles = createStylesTask(config);

  it('creates dist folder if it does not exist', async () => {
    await styles();
    expect(config.target).to.be.a.directory();
  })

  it('does build sass file without underscore', async () => {
    await styles();
    expect(`${config.target}/file.css`).to.be.a.file();
  })

  it('does not build partial with underscore', async () => {
    await styles();
    expect(`${config.target}/_partial.css`).to.not.be.a.path();
    expect(`${config.target}/partial.css`).to.not.be.a.path();
  })

  it('does compile sass', async () => {
    expect(`${process.cwd()}/test_stubs/src/sass/file.scss`).to.be.a.file().and.have.contents.that.match(/\$var/);
    await styles();
    expect(`${config.target}/file.css`).to.be.a.file().and.not.have.contents.that.match(/\$var/);
  })

  it('minifies files', async () => {
    expect(`${process.cwd()}/test_stubs/src/sass/file.scss`).to.be.a.file().and.have.contents.that.match(/[ \n\r]/);
    await styles();
    expect(`${config.target}/file.css`).to.be.a.file().and.not.have.contents.that.match(/[ \n\r]/);
  })

  it('autoprefixes', async () => {
    expect(`${process.cwd()}/test_stubs/src/sass/file.scss`).to.be.a.file().and.not.have.contents.that.match(/-webkit/);
    await styles();
    expect(`${config.target}/file.css`).to.be.a.file().with.contents.that.match(/-webkit/);
  })

  it('creates files for legacy browsers', async () => {
    await styles();
    expect(`${config.target}/file.legacy.css`).to.be.a.file();
  })

  it('resolves custom properties for legacy browsers', async () => {
    expect(`${process.cwd()}/test_stubs/src/sass/file.scss`).to.be.a.file().and.have.contents.that.match(/--main-var/);
    await styles();
    expect(`${config.target}/file.legacy.css`).to.be.a.file().and.not.have.contents.that.match(/--main-var/);
  })
});