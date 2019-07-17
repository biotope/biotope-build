export interface SassConfig {
  entryGlob?: string;
  target?: string;
  supportLegacy?: boolean;
}

export interface ServeConfig {
  port?: number;
  tempFolder?: string;
  layoutFile?: string;
}

export interface BuildConfig {
  sass?: SassConfig;
  serve?: ServeConfig;
}

export const defaultConfig: BuildConfig = {
  sass: {
    entryGlob: `src/resources/scss/**/*.scss`,
    target: `dist/`,
    supportLegacy: false
  },
  serve: {
    port: 9000,
    tempFolder: '.tmp',
    layoutFile: 'preview/index.ejs'
  }
}