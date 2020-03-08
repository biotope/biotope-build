import { crc32 } from 'crc';

export const checksum = (data: string | Uint8Array): string => crc32(data.toString()).toString(16);
