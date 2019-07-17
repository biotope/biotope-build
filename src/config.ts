export interface SassConfig {
  entryGlob?: string;
  target?: string;
  supportLegacy?: boolean;
}

export interface ServeConfig {
  port?: number;
  tempFolder?: string;
  previewRoot?: string;
}

export interface BuildConfig {
  sass?: SassConfig;
  serve?: ServeConfig;
}

export const defaultConfig: BuildConfig = {
  sass: {
    entryGlob: `${process.cwd()}/src/resources/scss/**/*.scss`,
    target: `${process.cwd()}/dist/`,
    supportLegacy: false
  },
  serve: {
    port: 9000,
    previewRoot: 'preview',
    tempFolder: '.tmp'
  }
}