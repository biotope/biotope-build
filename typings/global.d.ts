
declare interface IndexObject<T> {
  [key: string]: T;
}

declare type IndexObjectAny = IndexObject<any>;
