import {Router} from 'express';
import ah from 'express-async-handler';
import path from 'path';
import {get, upload, download, processNative} from './image.controller';

import multer from 'multer';
const media = multer({dest: path.resolve(__dirname, '..', '..', '..', '.tmp')});

const image = Router();

image.post('/get', ah(get));
image.post('/upload', media.single('image'), ah(upload));
image.get('/download/:imageId', ah(download));

image.post('/process-native', ah(processNative));

export default image;
