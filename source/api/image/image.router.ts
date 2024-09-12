import {Router} from 'express';
import ah from 'express-async-handler';
import {signIn, signUp, logout, me} from './image.controller';

const auth = Router();

auth.post('/sign-in', ah(signIn));
auth.post('/sign-up', ah(signUp));
auth.post('/logout', ah(logout));
auth.post('/me', ah(me));

export default auth;
