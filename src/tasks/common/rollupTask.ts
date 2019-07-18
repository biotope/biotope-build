import * as rollup from 'rollup';
import { src, dest } from 'gulp';
import * as scss from 'rollup-plugin-scss';
import * as typescript from 'rollup-plugin-typescript';
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const rollupTask = () => new Promise(async (res, rej) => {
    const bundle = await rollup.rollup({
        input: process.cwd() + '/src/components/CssVars/index.ts',
        plugins: [
          scss({ output: false }),
          typescript(),
          commonjs({ include: process.cwd() + '/node_modules/**' }),
          nodeResolve({ browser: true }),
        ],
    });

    await bundle.generate({
      dir: process.cwd() + '/tmp',
      format: 'esm',
      chunkFileNames: '[name].js',
    });
    
    res();
})


export default rollupTask;