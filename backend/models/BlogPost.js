// models/BlogPost.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Schema per i commenti
const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readtime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true },
  content: { type: String, required: true },
  comments: [commentSchema] //aggiunta dei commenti come un array
});

blogPostSchema.plugin(mongoosePaginate);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
