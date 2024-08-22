import {Router} from 'express';
import ah from 'express-async-handler';
import {method} from './ping.controller';

const ping = Router();

ping.use('/', ah(method));

export default ping;
