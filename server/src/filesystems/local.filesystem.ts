import {
    PathOrFileDescriptor,
    readFile,
    readFileSync,
    writeFile,
    WriteFileOptions,
    writeFileSync,
} from 'fs';
import { resolve as pathResolve } from 'path';
import { FilesystemInterface } from '../interfaces/filesystem.interface';

export class LocalFilesystem implements FilesystemInterface {
    protected path = pathResolve(__dirname, '../../storage');

    read(path: PathOrFileDescriptor) {
        return new Promise<Buffer>((resolve, reject) => {
            readFile(pathResolve(this.path, path.toString()), (error, data) => {
                if (error) {
                    return reject(error);
                }

                return resolve(data);
            });
        });
    }

    readSync(path: PathOrFileDescriptor) {
        return readFileSync(pathResolve(this.path, path.toString()));
    }

    write(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions
    ) {
        const finalPath = pathResolve(this.path, path.toString());
        return new Promise<string>((resolve, reject) => {
            writeFile(finalPath, data, options || {}, (error) => {
                if (error) {
                    return reject(error);
                }

                return resolve(finalPath);
            });
        });
    }

    writeSync(
        path: PathOrFileDescriptor,
        data: string | NodeJS.ArrayBufferView,
        options?: WriteFileOptions
    ) {
        const finalPath = pathResolve(this.path, path.toString());
        writeFileSync(finalPath, data, options);
        return finalPath;
    }
}
