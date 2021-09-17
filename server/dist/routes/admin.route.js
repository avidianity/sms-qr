"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const bcrypt_1 = require("bcrypt");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const unique_validator_1 = require("../validators/unique.validator");
const router = (0, express_1.Router)();
router.use((0, authenticate_middleware_1.default)());
router.use((req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return res.status(403).json({ message: 'User is not an admin.' });
    }
    return next();
});
router.get('/', async (req, res) => {
    const client = req.app.get('prisma');
    return res.json(await client.user.findMany({
        where: {
            role: 'ADMIN',
        },
    }));
});
router.get('/:id', async (req, res) => {
    const client = req.app.get('prisma');
    const admin = await client.user.findFirst({
        where: {
            id: req.params.id.toNumber(),
            role: 'ADMIN',
        },
    });
    if (!admin) {
        return res.status(404).json({ message: 'Admin does not exist.' });
    }
    return res.json(admin);
});
router.post('/', [
    (0, express_validator_1.body)('email').isEmail().custom((0, unique_validator_1.unique)('user', 'email')),
    (0, express_validator_1.body)('password').isStrongPassword(),
    (0, express_validator_1.body)('name').isString().notEmpty(),
    (0, express_validator_1.body)('number')
        .isString()
        .notEmpty()
        .custom((0, unique_validator_1.unique)('user', 'number')),
], validation_middleware_1.default, async (req, res) => {
    const { email, password, name, number } = req.body;
    const client = req.app.get('prisma');
    const user = await client.user.create({
        data: {
            uuid: (0, uuid_1.v4)(),
            email,
            name,
            password: await (0, bcrypt_1.hash)(password, 8),
            role: 'ADMIN',
            number,
        },
    });
    return res.status(201).json(user);
});
function update() {
    return [
        [
            (0, express_validator_1.body)('email')
                .isEmail()
                .custom((0, unique_validator_1.unique)('user', 'email'))
                .optional(),
            (0, express_validator_1.body)('password').isStrongPassword().optional(),
            (0, express_validator_1.body)('name').isString().notEmpty().optional(),
            (0, express_validator_1.body)('number')
                .isString()
                .notEmpty()
                .custom((0, unique_validator_1.unique)('user', 'number'))
                .optional(),
        ],
        validation_middleware_1.default,
        async (req, res) => {
            const data = req.body;
            if (data.password) {
                data.password = await (0, bcrypt_1.hash)(data.password, 8);
            }
            const id = req.params.id.toNumber();
            const client = req.app.get('prisma');
            const user = await client.user.update({
                where: {
                    id,
                },
                data,
            });
            return res.json(user);
        },
    ];
}
router.put('/:id', ...update());
router.patch('/:id', ...update());
router.delete('/:id', async (req, res) => {
    const client = req.app.get('prisma');
    const id = req.params.id.toNumber();
    const admin = await client.user.findFirst({
        where: {
            id,
            role: 'ADMIN',
        },
        include: {
            attendances: true,
        },
    });
    if (!admin) {
        return res.status(404).json({ message: 'Admin does not exist.' });
    }
    await client.attendance.deleteMany({
        where: {
            id: {
                in: admin.attendances.map((attendance) => attendance.id),
            },
        },
    });
    await client.user.delete({
        where: {
            id,
        },
    });
    return res.status(204).end();
});
exports.adminRoutes = router;
