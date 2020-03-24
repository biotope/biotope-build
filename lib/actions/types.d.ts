import { CommanderStatic } from 'commander';
export declare type Action = (program: CommanderStatic) => CommanderStatic;
export declare type Actions = Record<string, Action>;
