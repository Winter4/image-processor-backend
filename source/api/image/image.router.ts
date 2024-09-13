import {Router} from 'express';
import ah from 'express-async-handler';
import path from 'path';
import {get, upload} from './image.controller';

import multer from 'multer';
const media = multer({dest: path.resolve(__dirname, '..', '..', '..', '.tmp')});

const auth = Router();

auth.post('/get', ah(get));
auth.post('/upload', media.single('image'), ah(upload));

export default auth;
