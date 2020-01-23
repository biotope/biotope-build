import { crc32 } from 'crc';

export const checksum = (data: string | Buffer): string => crc32(data).toString(16);
