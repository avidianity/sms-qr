"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = void 0;
const client_1 = require("@prisma/client");
const lodash_1 = require("lodash");
const client = new client_1.PrismaClient();
function unique(model, key, message) {
    return async (value) => {
        try {
            const exists = await client[model].findFirst({
                where: {
                    [key]: value,
                },
            });
            if (exists) {
                return Promise.reject(message
                    ? message
                    : `${(0, lodash_1.startCase)((0, lodash_1.toLower)(key.toString()))} is already taken.`);
            }
            return true;
        }
        catch (error) {
            console.error(error);
            return Promise.reject(`Unable to verify ${key}.`);
        }
    };
}
exports.unique = unique;
