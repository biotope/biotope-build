
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type RecordAny = Record<string, any>;

declare module '*.scss' {
  interface StyleObject extends Record<string, string> {
    default: string;
  }
  const exports: StyleObject;
  export default exports;
}

// FIXME: Typescript limitation on importing deconstructed json files
// declare module '*.json' {
//   const content: RecordAny;
//   export = content;
// }
declare module '*.json';

declare module '*.svg';

declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
