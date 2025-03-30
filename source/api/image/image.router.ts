import {Router} from 'express';
import ah from 'express-async-handler';
import path from 'path';
import {processNative, processWasm} from './image.controller';

import multer from 'multer';

/* - - - - - - - - - - - - - - - - - - */

const image = Router();
const media = multer({dest: path.resolve(__dirname, '..', '..', '..', '.tmp')});

image.post('/process-native', media.single('image'), ah(processNative));
image.post('/process-wasm', media.single('image'), ah(processWasm));

export default image;
