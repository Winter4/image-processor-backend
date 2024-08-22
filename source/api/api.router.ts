import {Router} from 'express';

import ping from './ping/ping.router';

const api = Router();

api.use('/ping', ping);

export default api;
