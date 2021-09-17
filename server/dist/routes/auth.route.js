"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const helpers_1 = require("../helpers");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = __importDefault(require("../middlewares/validation.middleware"));
const authenticate_middleware_1 = __importDefault(require("../middlewares/authenticate.middleware"));
const unique_validator_1 = require("../validators/unique.validator");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().custom((0, unique_validator_1.unique)('user', 'email')),
    (0, express_validator_1.body)('password').isStrongPassword(),
    (0, express_validator_1.body)('name').isString().notEmpty(),
    (0, express_validator_1.body)('number')
        .isString()
        .notEmpty()
        .custom((0, unique_validator_1.unique)('user', 'number')),
], validation_middleware_1.default, async (req, res) => {
    const { email, name, password, number } = req.body;
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
    const token = jsonwebtoken_1.default.sign({ uuid: user.uuid }, (0, helpers_1.config)('jwt.key'), {
        expiresIn: (0, helpers_1.config)('jwt.expiry'),
    });
    return res.status(201).json({ token, user });
});
router.post('/login', [(0, express_validator_1.body)('email').isEmail(), (0, express_validator_1.body)('password').isString().notEmpty()], validation_middleware_1.default, async (req, res) => {
    const { email, password } = req.body;
    const client = req.app.get('prisma');
    const user = await client.user.findFirst({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User does not exist.' });
    }
    if (!(await (0, bcrypt_1.compare)(password, user.password))) {
        return res.status(401).json({ message: 'Password is incorrect.' });
    }
    const token = jsonwebtoken_1.default.sign({ uuid: user.uuid, role: user.role }, (0, helpers_1.config)('jwt.key'), {
        expiresIn: (0, helpers_1.config)('jwt.expiry'),
    });
    return res.status(201).json({ token, user });
});
router.get('/check', (0, authenticate_middleware_1.default)(), (req, res) => {
    var _a, _b;
    return res.json({
        user: req.user,
        token: jsonwebtoken_1.default.sign({ uuid: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uuid, role: (_b = req.user) === null || _b === void 0 ? void 0 : _b.role }, (0, helpers_1.config)('jwt.key'), {
            expiresIn: (0, helpers_1.config)('jwt.expiry'),
        }),
    });
});
exports.authRoute = router;
