import { CommanderStatic } from 'commander';

export type Action = (program: CommanderStatic) => CommanderStatic;
export type Actions = Record<string, Action>;
