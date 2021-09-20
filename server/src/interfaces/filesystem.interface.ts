import { PathOrFileDescriptor } from 'fs';

export interface FilesystemInterface {
    read(path: PathOrFileDescriptor): Promise<Buffer>;
    readSync(path: PathOrFileDescriptor): Buffer;
    write(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView
    ): Promise<string>;
    writeSync(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView
    ): string;
}
