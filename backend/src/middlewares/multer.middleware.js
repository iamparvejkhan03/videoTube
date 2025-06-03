import multer, { diskStorage } from 'multer';

const upload = multer({storage: diskStorage({destination: './public/tmp', filename: (req, file, cb) => cb(null, file.originalname)})});

export {upload}