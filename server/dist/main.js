"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("@avidian/extras");
require("./boot");
require("./shims");
const helpers_1 = require("./helpers");
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const auth_route_1 = require("./routes/auth.route");
const admin_route_1 = require("./routes/admin.route");
const teacher_route_1 = require("./routes/teacher.route");
const qr_route_1 = require("./routes/qr.route");
const bcrypt_1 = require("bcrypt");
const uuid_1 = require("uuid");
(async () => {
    const logger = (0, helpers_1.getLogger)();
    const app = (0, express_1.default)();
    app.use((0, express_1.json)());
    app.use((0, cors_1.default)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(passport_1.default.initialize());
    const port = process.env.PORT || 5000;
    const client = new client_1.PrismaClient();
    await client.$connect();
    app.set('prisma', client);
    passport_1.default.use(new passport_jwt_1.Strategy({
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: (0, helpers_1.config)('jwt.key'),
    }, async (payload, done) => {
        try {
            const user = await client.user.findFirst({
                where: {
                    uuid: payload.uuid,
                },
            });
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        }
        catch (error) {
            done(error);
        }
    }));
    app.use('/auth', auth_route_1.authRoute);
    app.use('/admins', admin_route_1.adminRoutes);
    app.use('/teachers', teacher_route_1.teacherRoutes);
    app.use('/qr', qr_route_1.qrRoutes);
    app.use((_, res) => {
        return res.status(404).end();
    });
    app.listen(port, () => {
        logger.success(`Server listening at ${port}`);
    });
    app.on('close', async () => {
        await client.$disconnect();
    });
    const admin = await client.user.findFirst({
        where: {
            role: 'ADMIN',
        },
    });
    if (!admin) {
        await client.user.create({
            data: {
                name: 'Admin',
                email: 'admin@gmail.com',
                password: await (0, bcrypt_1.hash)('admin', 8),
                number: '09837283745',
                role: 'ADMIN',
                uuid: (0, uuid_1.v4)(),
            },
        });
    }
})();
