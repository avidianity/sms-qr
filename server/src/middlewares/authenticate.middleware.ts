import passport from 'passport';

export default function authenticate() {
    return passport.authenticate('jwt', { session: false });
}
