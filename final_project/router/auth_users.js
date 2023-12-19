const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.filter(user => user.username === username).length === 0;
}

const authenticatedUser = (username,password) => { 
  const user = users.filter(user => user.username === username && user.password === password);
  return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    res.status(404).json({ message: "Error logging in." });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 })

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({ message: "User successfully logged in." });
  } else {
    return res.status(208).json({ message: "Invalid username or password!" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { review } = req.query;
  const { isbn } = req.params;

  if (isbn && books[isbn]) {
    const reviews = books[isbn].reviews;
    reviews[username] = review;
    res.status(200).json({ reviews: reviews })
  } else {
    res.status(404).json({ mesage: "Book not found!"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;

  if (isbn && books[isbn]) {
    const reviews = books[isbn].reviews;
    delete reviews[username];
    res.status(200).json({ reviews: reviews })
  } else {
    res.status(404).json({ mesage: "Book not found!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
