import {Router} from 'express';

import ping from './ping/ping.router';
import image from './image/image.router';

const api = Router();

api.use('/ping', ping);
api.use('/image', image);

export default api;
