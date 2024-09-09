import mongoose from 'mongoose';
//definisce lo schema per gli autori
const { Schema, model } = mongoose;

const authorSchema = new Schema({
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dataDiNascita: { type: String, required: true },
  avatar: { type: String, required: true },
});

const Author = model('Author', authorSchema);

export default Author;
