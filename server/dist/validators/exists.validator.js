"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const client_1 = require("@prisma/client");
const lodash_1 = require("lodash");
const client = new client_1.PrismaClient();
function exists(model, key, message) {
    return async (value) => {
        try {
            const exists = await client[model].findFirst({
                where: {
                    [key]: value,
                },
            });
            if (!exists) {
                return Promise.reject(message
                    ? message
                    : `${(0, lodash_1.startCase)((0, lodash_1.toLower)(key.toString()))} is does not exist.`);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return Promise.reject(`Unable to verify ${key}.`);
        }
    };
}
exports.exists = exists;
