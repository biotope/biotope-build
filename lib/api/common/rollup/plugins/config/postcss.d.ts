import { ParsedOptions } from '../../../types';
interface Extractor {
    originalNames: string[];
    plugin: Function;
    getJSON: (_: string, __: Record<string, string>, ___: string) => void;
}
export declare const postcss: (config: ParsedOptions, extracted: Record<string, string>, extractor?: Extractor) => object;
export {};
