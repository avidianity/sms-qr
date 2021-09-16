import cors from 'cors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import './boot';
import './shims';
import { config, getLogger } from './helpers';
import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { authRoute } from './routes/auth.route';

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

    app.listen(port, () => {
        logger.success(`Server listening at ${port}`);
    });

    app.on('close', async () => {
        await client.$disconnect();
    });
})();
