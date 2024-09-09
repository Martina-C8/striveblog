import express from 'express';
import Author from '../models/Author.js';
import upload from '../config/multer.js';

const router = express.Router();

// GET /authors - Ritorna la lista degli autori
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli autori', error });
  }
});

// GET /authors/:id - Ritorna un singolo autore
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dell\'autore', error });
  }
});

// POST /authors - Crea un nuovo autore
router.post('/', async (req, res) => {
  try {
    const newAuthor = new Author(req.body);
    const savedAuthor = await newAuthor.save();
    res.status(201).json(savedAuthor);
  } catch (error) {
    res.status(400).json({ message: 'Errore nella creazione dell\'autore', error });
  }
});

// PUT /authors/:id - Modifica un autore esistente
router.put('/:id', async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAuthor) return res.status(404).json({ message: 'Autore non trovato' });
    res.json(updatedAuthor);
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiornamento dell\'autore', error });
  }
});

// DELETE /authors/:id - Cancella un autore
router.delete('/:id', async (req, res) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) return res.status(404).json({ message: 'Autore non trovato' });
    res.json({ message: 'Autore cancellato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella cancellazione dell\'autore', error });
  }
});

// Rotta per caricare l'avatar dell'autore
router.patch('/:authorId/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const author = await Author.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ message: 'Autore non trovato' });
    }
    
    // Aggiorna l'avatar URL dell'autore con il link generato da Cloudinary
    author.avatar = req.file.path;
    await author.save();

    res.json({ message: 'Avatar aggiornato con successo', avatar: author.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
