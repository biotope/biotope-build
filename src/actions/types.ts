import { Command } from 'commander';

export type Action = (program: Command) => Command;
export type Actions = IndexObject<Action>;
