import { createProgram, CompilerOptions } from 'typescript';

export const tsc = (fileNames: string[], options: CompilerOptions): void => {
  const program = createProgram(fileNames, options);
  const exitCode = program.emit().emitSkipped ? 1 : 0;

  if (exitCode) {
    process.exit(exitCode);
    // eslint-disable-next-line no-console
    console.log(`Process exiting with code '${exitCode}'.`);
  }
};
