import cors from 'cors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import '@avidian/extras';
import './boot';
import './shims';
import { config, getLogger } from './helpers';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { authRoute } from './routes/auth.route';
import { adminRoutes } from './routes/admin.route';
import { teacherRoutes } from './routes/teacher.route';
import { qrRoutes } from './routes/qr.route';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';
import { errorHandler } from './middlewares/error-handler.middleware';
import { attendanceRoutes } from './routes/attendance.route';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault(process.env.TZ);

(async () => {
    const logger = getLogger();

    const app = express();

    app.use(json());
    app.use(cors());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(passport.initialize());

    const port = process.env.PORT || 5000;

    const client = new PrismaClient();

    await client.$connect();

    client.$use(async (params, next) => {
        const result = await next(params);
        logger.info(`[database]`, result);
        return result;
    });

    app.set('prisma', client);

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ExtractJwt.fromUrlQueryParameter('token'),
                ]),
                secretOrKey: config('jwt.key'),
            },
            async (payload, done) => {
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
                } catch (error) {
                    done(error);
                }
            }
        )
    );

    app.use('/auth', authRoute);
    app.use('/admins', adminRoutes);
    app.use('/teachers', teacherRoutes);
    app.use('/qr', qrRoutes);
    app.use('/attendances', attendanceRoutes);

    app.use((_, res) => {
        return res.status(404).end();
    });

    app.use(errorHandler);

    app.listen(port, () => {
        logger.success(`Server listening at ${port}`);
        logger.info(`Environment: ${process.env.ENV}`);
        logger.info(`${config(`semaphore.urls.${process.env.ENV}`)}`);
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
                password: await hash('admin', 8),
                number: '09169258735',
                role: 'ADMIN',
                uuid: v4(),
            },
        });
    }
})();
