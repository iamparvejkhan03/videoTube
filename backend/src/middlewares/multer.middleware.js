import multer, { diskStorage } from 'multer';
import path from 'path';

const upload = multer({storage: diskStorage({destination: path.resolve('public/tmp'), filename: (req, file, cb) => {cb(null, file.originalname)}})});

export {upload}