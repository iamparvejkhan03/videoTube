import 'dotenv/config';
import connectDB from './db/index.js';
import app from './app.js';

connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
}).catch(error => console.log("Error while connecting the database in the index file ", error));