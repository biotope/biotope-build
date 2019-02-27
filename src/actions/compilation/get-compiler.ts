import * as webpack from 'webpack';

import { environments, webpackInit, ProjectEnvironment } from '../../webpack';

export interface CompileOptions {
  config?: string;
  environment?: ProjectEnvironment;
  watch?: boolean;
  open?: boolean;
  spa?: boolean;
}

export const getCompiler = ({ config, environment }: CompileOptions): webpack.Compiler => {
  const nodeEnvironment = environments[environment || 'default'];
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const compiler = webpack(webpackInit(nodeEnvironment, (config && require(config)) || {}));
  (new webpack.ProgressPlugin()).apply(compiler);

  return compiler;
};
