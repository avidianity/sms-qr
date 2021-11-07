import { PathOrFileDescriptor, WriteFileOptions } from 'fs';

export interface FilesystemInterface {
    read(path: PathOrFileDescriptor): Promise<Buffer>;
    readSync(path: PathOrFileDescriptor): Buffer;
    write(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions
    ): Promise<string>;
    writeSync(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions
    ): string;
}
