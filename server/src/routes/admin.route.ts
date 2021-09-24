import { PrismaClient, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { v4 } from 'uuid';
import authenticate from '../middlewares/authenticate.middleware';
import validate from '../middlewares/validate.middleware';
import { unique } from '../validators/unique.validator';
import 'express-async-errors';

const router = Router();

router.use(authenticate());
router.use((req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'User is not an admin.' });
    }

    return next();
});

router.get('/', async (req, res) => {
    const client: PrismaClient = req.app.get('prisma');

    return res.json(
        await client.user.findMany({
            where: {
                role: 'ADMIN',
            },
        })
    );
});

router.get('/:id', async (req, res) => {
    const client: PrismaClient = req.app.get('prisma');

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

router.post(
    '/',
    [
        body('email').isEmail().custom(unique<User>('user', 'email')),
        body('password').isStrongPassword(),
        body('name').isString().notEmpty(),
        body('number')
            .isString()
            .notEmpty()
            .custom(unique<User>('user', 'number')),
    ],
    validate,
    async (req: Request, res: Response) => {
        const { email, password, name, number } = req.body;

        const client: PrismaClient = req.app.get('prisma');

        const user = await client.user.create({
            data: {
                uuid: v4(),
                email,
                name,
                password: await hash(password, 8),
                role: 'ADMIN',
                number,
            },
        });

        return res.status(201).json(user);
    }
);

function update() {
    return [
        [
            body('email')
                .isEmail()
                .custom(unique<User>('user', 'email'))
                .optional(),
            body('password').isStrongPassword().optional(),
            body('name').isString().notEmpty().optional(),
            body('number')
                .isString()
                .notEmpty()
                .custom(unique<User>('user', 'number'))
                .optional(),
        ],
        validate,
        async (req: Request, res: Response) => {
            const data = req.body;

            if (data.password) {
                data.password = await hash(data.password, 8);
            }

            const id = req.params.id.toNumber();

            const client: PrismaClient = req.app.get('prisma');

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
    const client: PrismaClient = req.app.get('prisma');

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

export const adminRoutes = router;
