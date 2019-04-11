import * as findFreePortSync from 'find-free-port-sync';

export const freePorts = (ports: number[], range: number = 99): number[] => ports
  .map((port): number => findFreePortSync({
    start: port,
    end: port + range,
  }));
