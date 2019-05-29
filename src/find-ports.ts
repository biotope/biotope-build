import * as getPort from 'get-port';
import * as synchronizedPromise from 'synchronized-promise';

const getPortSync = synchronizedPromise(getPort);

export const findPort = (port: number, range: number = 999): number => getPortSync({
  port: getPort.makeRange(port, port + range),
});

export const findPorts = (ports: number[], range?: number): number[] => ports
  .map((port): number => findPort(port, range));
