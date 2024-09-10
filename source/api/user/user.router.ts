import {Router} from 'express';
import ah from 'express-async-handler';
import {get} from './user.controller';

const user = Router();

user.post('/get', ah(get));

export default user;
