
declare module 'node-eval' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeEval: (_: string, __: string) => any;
  export = nodeEval;
}
