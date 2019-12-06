import { Command } from 'commander';

export type Action = (program: Command) => Command;
export type Actions = Record<string, Action>;
