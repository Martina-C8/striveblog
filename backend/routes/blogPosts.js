// routes/blogPosts.js
import express from 'express';
import BlogPost from '../models/BlogPost.js';
import upload from '../config/multer.js';

const router = express.Router();

// Ottieni una lista di blog post con paginazione
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };
    const result = await BlogPost.paginate({}, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni un singolo blog post
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un nuovo blog post
router.post('/', async (req, res) => {
  const blogPost = new BlogPost({
    category: req.body.category,
    title: req.body.title,
    cover: req.body.cover,
    readtime: req.body.readtime,
    author: req.body.author,
    content: req.body.content
  });

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Modifica un blog post esistente
router.put('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
    res.json(blogPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancella un blog post
router.delete('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
    res.json({ message: 'Blog post cancellato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:blogPostId/cover', upload.single('cover'), async (req, res) => {
    try {
      const blogPost = await BlogPost.findById(req.params.blogPostId);
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post non trovato' });
      }
      
      // Aggiorna la cover URL del blog post con il link generato da Cloudinary
      blogPost.cover = req.file.path;
      await blogPost.save();
  
      res.json({ message: 'Cover aggiornata con successo', cover: blogPost.cover });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========================= COMMENTI =========================

// Ottieni tutti i commenti di un post specifico
router.get('/:id/comments', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }
    res.json(blogPost.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni un commento specifico di un post
router.get('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aggiungi un nuovo commento a un post specifico
router.post('/:id/comments', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const newComment = {
      author: req.body.author,
      text: req.body.text,
    };

    blogPost.comments.push(newComment);
    await blogPost.save();
    res.status(201).json(blogPost.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifica un commento specifico
router.put('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    comment.text = req.body.text || comment.text;
    comment.author = req.body.author || comment.author;

    await blogPost.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Elimina un commento specifico
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post non trovato' });
    }

    const comment = blogPost.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato' });
    }

    comment.remove();
    await blogPost.save();
    res.json({ message: 'Commento eliminato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  

export default router;
