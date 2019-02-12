import * as webpack from 'webpack';

import { environments, webpackInit, ProjectEnvironment } from '../../webpack';
import { getConfig } from './get-config';

export interface CompileOptions {
  config?: string;
  environment?: ProjectEnvironment;
  watch?: boolean;
  spa?: boolean;
}

export const getCompiler = ({ config, environment }: CompileOptions): webpack.Compiler => {
  const nodeEnvironment = environments[environment || 'default'];
  const compiler = webpack(webpackInit(nodeEnvironment, getConfig(config)));
  (new webpack.ProgressPlugin()).apply(compiler);

  return compiler;
};
