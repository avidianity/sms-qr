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

    app.set('prisma', client);

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
                password: await hash('admin', 8),
                number: '09837283745',
                role: 'ADMIN',
                uuid: v4(),
            },
        });
    }
})();
