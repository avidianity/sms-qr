import { PrismaClient } from '@prisma/client';
import { ModelInterface } from '../interfaces/model.interface';
import { startCase, toLower } from 'lodash';

const client = new PrismaClient();

export function exists<T extends ModelInterface>(
    model: string,
    key: keyof T,
    message?: string
) {
    return async (value: any) => {
        try {
            const exists = await (client as any)[model].findFirst({
                where: {
                    [key]: value,
                },
            });
            if (!exists) {
                return Promise.reject(
                    message
                        ? message
                        : `${startCase(
                              toLower(key.toString())
                          )} is does not exist.`
                );
            }
            return true;
        } catch (error) {
            console.error(error);
            return Promise.reject(`Unable to verify ${key}.`);
        }
    };
}
