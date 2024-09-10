import {Router} from 'express';

import ping from './ping/ping.router';
import auth from './auth/auth.router';
import user from './user/user.router';

const api = Router();

api.use('/ping', ping);
api.use('/auth', auth);
api.use('/user', user);

export default api;
