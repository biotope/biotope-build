
export interface ServeConfig {
  port?: number;
  layoutFile?: string;
}

export interface BuildConfig {
  bundles?: { [key: string]: string } | string[];
  vendorChunks?: string[];
  paths?: {
    distFolder?: string;
    vendorFolder?: string;
  };
  extensions?: string[];
  serve?: ServeConfig;
  legacy?: boolean;
}

export const defaultConfig: BuildConfig = {
  bundles: [
    './src/**/*.js',
    './src/**/*.ts',
  ],
  vendorChunks: [
    '@biotope/element',
  ],
  paths: {
    distFolder: 'dist',
    vendorFolder: 'vendor',
  },
  extensions: ['.js', '.ts'],
  serve: {
    port: 9000,
    layoutFile: 'preview/index.ejs'
  },
  legacy: true,
};
