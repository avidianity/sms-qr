"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrRoutes = void 0;
const semaphorejs_1 = __importDefault(require("@avidian/semaphorejs"));
const dayjs_1 = __importDefault(require("dayjs"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const helpers_1 = require("../helpers");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const teacher_middleware_1 = require("../middlewares/teacher.middleware");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const router = (0, express_1.Router)();
router.use((0, authenticate_middleware_1.default)());
router.get('/:id', teacher_middleware_1.teacher, async (req, res) => {
    const client = req.app.get('prisma');
    const teacher = await client.user.findFirst({
        where: {
            id: req.params.id.toNumber(),
            role: 'TEACHER',
        },
    });
    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }
    return res.send(helpers_1.Crypto.encrypt({
        id: teacher.id,
        uuid: teacher.uuid,
        email: teacher.email,
        date: new Date().toJSON(),
    }));
});
router.post('/parse', admin_middleware_1.admin, [(0, express_validator_1.body)('payload').isString().notEmpty()], validation_middleware_1.default, async (req, res) => {
    const client = req.app.get('prisma');
    const { payload } = req.body;
    const { id } = helpers_1.Crypto.decrypt(payload);
    const teacher = await client.user.findFirst({
        where: {
            id,
            role: 'TEACHER',
        },
    });
    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }
    const attendance = await client.attendance.create({
        data: {
            userId: teacher.id,
        },
    });
    const env = (0, helpers_1.config)('app.env');
    const admins = await client.user.findMany({
        where: {
            role: 'ADMIN',
        },
    });
    const semaphore = new semaphorejs_1.default((0, helpers_1.config)('semaphore.token'), {
        baseUrl: (0, helpers_1.config)(`semaphore.urls.${env}`),
    });
    await semaphore.send(admins.map((admin) => admin.number), `Teacher ${teacher.name} has scanned the QR at ${(0, dayjs_1.default)(attendance.createdAt).format('MMMM DD, YYYY hh:mm A')}`);
    return res.status(201).json({ attendance, teacher });
});
exports.qrRoutes = router;
