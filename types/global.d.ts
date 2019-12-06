
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type RecordAny = Record<string, any>;

// FIXME: Typescript limitation on importing deconstructed json files
// declare module '*.json' {
//   const content: RecordAny;
//   export = content;
// }
declare module '*.json';
