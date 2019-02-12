
declare interface IndexObject<T> {
  [key: string]: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-interface
declare interface IndexObjectAny extends IndexObject<any> {}

declare module '*.style' {
  interface BiotopeBuildStyle extends IndexObject<string> {
    // FIXME: toString should be specified as described in the comment beside it, but due to the
    // definition of IndexObject, the value of all keys should be of the same type (string).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toString: any; // should be of type "() => string"
  }
  const style: BiotopeBuildStyle;
  export = style;
}

declare module '*.svg' {
  const content: string;
  export = content;
}

// FIXME: Typescript limitation on importing deconstructed json files
// declare module '*.json' {
//   const content: IndexObjectAny;
//   export = content;
// }
declare module '*.json';
