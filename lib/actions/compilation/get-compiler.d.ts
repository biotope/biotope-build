import * as webpack from 'webpack';
import { ProjectEnvironment } from '../../webpack';
export interface CompileOptions {
    config?: string;
    additionalCompilation?: string;
    environment?: ProjectEnvironment;
    watch?: boolean;
    open?: boolean;
    spa?: boolean;
}
export declare const getCompiler: ({ config, environment }: CompileOptions) => webpack.Compiler;
