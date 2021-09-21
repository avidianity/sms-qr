"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRoutes = void 0;
const bcrypt_1 = require("bcrypt");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const unique_validator_1 = require("../validators/unique.validator");
require("express-async-errors");
const router = (0, express_1.Router)();
router.use((0, authenticate_middleware_1.default)());
router.get('/', async (req, res) => {
    const client = req.app.get('prisma');
    return res.json(await client.user.findMany({
        where: {
            role: 'TEACHER',
        },
        include: {
            attendances: true,
        },
    }));
});
router.get('/:id', async (req, res) => {
    const client = req.app.get('prisma');
    const teacher = await client.user.findFirst({
        where: {
            id: req.params.id.toNumber(),
            role: 'TEACHER',
        },
        include: {
            attendances: true,
        },
    });
    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }
    return res.json(teacher);
});
router.get('/:id/attendances', async (req, res) => {
    const client = req.app.get('prisma');
    const id = req.params.id.toNumber();
    const teacher = await client.user.findFirst({
        where: {
            id,
            role: 'TEACHER',
        },
        include: {
            attendances: true,
        },
    });
    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }
    const attendances = await client.attendance.findMany({
        where: {
            userId: id,
        },
    });
    return res.json(attendances);
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
            role: 'TEACHER',
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
    const teacher = await client.user.findFirst({
        where: {
            id,
            role: 'TEACHER',
        },
        include: {
            attendances: true,
        },
    });
    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }
    await client.attendance.deleteMany({
        where: {
            id: {
                in: teacher.attendances.map((attendance) => attendance.id),
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
exports.teacherRoutes = router;
