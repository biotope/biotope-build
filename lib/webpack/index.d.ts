import { Configuration } from 'webpack';
import { Options, NodeEnvironment } from './settings';
export * from './settings';
export declare const webpackInit: (environment: NodeEnvironment, options: Options) => Configuration;
