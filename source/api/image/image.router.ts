import {Router} from 'express';
import ah from 'express-async-handler';
import path from 'path';
import {processNative, processWasmSinglethread, processWasmMultithread} from './image.controller';

import multer from 'multer';

/* - - - - - - - - - - - - - - - - - - */

const image = Router();
const media = multer({dest: path.resolve(__dirname, '..', '..', '..', '.tmp')});

image.post('/process-native', media.single('image'), ah(processNative));
image.post('/process-wasm-single', media.single('image'), ah(processWasmSinglethread));
image.post('/process-wasm-multi', media.single('image'), ah(processWasmMultithread));

export default image;
