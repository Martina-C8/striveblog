import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import authorRoutes from './routes/authors.js';
import blogPostRoutes from './routes/blogPosts.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('La variabile MONGO_URI non è definita nel file .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connessione a MongoDB avvenuta con successo!'))
  .catch((error) => console.error('Errore di connessione a MongoDB:', error));

app.use(cors())
app.use(express.json());
app.use('/authors', authorRoutes);
app.use('/blogPosts', blogPostRoutes);

app.get('/', (req, res) => {
  res.send('Benvenuto nell\'API del blog Strive!');
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
