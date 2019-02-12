import * as typescript from 'typescript';

export const tsc = (fileNames: string[], options: typescript.CompilerOptions): void => {
  const program = typescript.createProgram(fileNames, options);
  const exitCode = program.emit().emitSkipped ? 1 : 0;

  if (exitCode) {
    process.exit(exitCode);
    // eslint-disable-next-line no-console
    console.log(`Process exiting with code '${exitCode}'.`);
  }
};
