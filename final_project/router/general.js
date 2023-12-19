const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.query;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      res.status(200).json({ message: "User successfully registered!" });
    } else {
      res.status(404).json({ message: "User already exists!" });
    }
    res.status(404).json({ message: "Unable to register user." });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, ' ', 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.send(books[isbn]);
  }

  return res.status(404).json({ message: "Book is not found!"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;

  const filtered_books = Object.keys(books).reduce((prev, curr) => {
    if (books[curr].author === author) {
      prev[curr] = books[curr];
    }
    return prev;
  }, {});

  return res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;

  const filtered_books = Object.keys(books).reduce((prev, curr) => {
    if (books[curr].title === title) {
      prev[curr] = books[curr];
    }
    return prev;
  }, {});

  return res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.send(books[isbn].reviews);
  }
  
  return res.status(404).json({ message: "Book is not found!"});
});


// Improving the scope of Tasks 1-4 using Promises or Async-Await
const fetchData = async (url, method) => {
  const response = await axios({
    method,
    url
  });
  return response;
}

public_users.get("/async", async (_, res) => {
  try {
    const response = await fetchData('http://localhost:5000/', 'GET');
    res.status(200).send(JSON.stringify(response.data, ' ', 4));
  } catch (e) {
    res.status(500).json({ message: "Unable to fetch data!" });
  }
});

public_users.get('/async/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await fetchData(`http://localhost:5000/isbn/${isbn}`, 'GET');
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json({ message: "Unable to fetch data!" });
  }
 });

 public_users.get('/async/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await fetchData(`http://localhost:5000/author/${author}`, 'GET');
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json({ message: "Unable to fetch data!" });
  }
 });

 public_users.get('/async/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await fetchData(`http://localhost:5000/title/${title}`, 'GET');
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).json({ message: "Unable to fetch data!" });
  }
 });

module.exports.general = public_users;
