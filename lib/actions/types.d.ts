import { Command } from 'commander';
export declare type Action = (program: Command) => Command;
export declare type Actions = IndexObject<Action>;
