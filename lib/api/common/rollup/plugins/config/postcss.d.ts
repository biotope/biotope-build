import { ParsedOptions } from '../../../types';
interface Extractor {
    identifiers: string[];
    getJSON: (_: string, __: Record<string, string>, ___: string) => void;
    plugin: Function;
}
export declare const postcss: (config: ParsedOptions, extractor?: Extractor) => object;
export {};
