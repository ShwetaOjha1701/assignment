const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String
});

const Book = mongoose.model('books', bookSchema);

app.use(bodyParser.json());

// Create a new book
// insert data into database
app.post('/api/books', (req, res) => {
  const { title, author, summary } = req.body;
  const book = new Book({ title, author, summary });
  book.save()
    .then(() => res.json(book))
    .catch(err => res.status(400).json(err));
});

// Get a list of all books
// api to get data from database
app.get('/api/books', (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(500).json(err));
});

// Get details of a specific book by its ID
app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findById(bookId)
    .then(book => res.json(book))
    .catch(err => res.status(404).json(err));
});

// Update a book's details
// update data by particular id
app.put('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findByIdAndUpdate(bookId, req.body, { new: true })
    .then(book => res.json(book))
    .catch(err => res.status(400).json(err));
});

// Delete a book
// delete data by id
app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findByIdAndRemove(bookId)
    .then(book => res.json(book))
    .catch(err => res.status(404).json(err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
