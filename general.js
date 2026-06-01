const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the list of books available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const availableBooks = await getBooks();
    return res.status(200).send(JSON.stringify(availableBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = (isbn) => new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
  
// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = (author) => new Promise((resolve) => {
        let results = {};
        for (let isbn in books) {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                results[isbn] = books[isbn];
            }
        }
        resolve(results);
    });
    const filteredBooks = await getBooksByAuthor(author);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error filtering books" });
  }
});

// Task 13: Get all books requlated by title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = (title) => new Promise((resolve) => {
        let results = {};
        for (let isbn in books) {
            if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                results[isbn] = books[isbn];
            }
        }
        resolve(results);
    });
    const filteredBooks = await getBooksByTitle(title);
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error filtering books" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports = public_users;
