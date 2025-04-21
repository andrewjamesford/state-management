# Express.js Documentation

## Overview

Express is a fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org/en/). It provides a robust set of features for web and mobile applications, making it one of the most popular frameworks for building web applications with Node.js.

## Installation

```bash
$ npm install express --save
```

## Hello World Example

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## Key Features

- **Web Applications**: Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **APIs**: With a myriad of HTTP utility methods and middleware at your disposal, creating a robust API is quick and easy.
- **Performance**: Express provides a thin layer of fundamental web application features, without obscuring Node.js features that you know and love.
- **Middleware**: Express is a lightweight and flexible routing framework with minimal core features meant to be augmented through the use of Express middleware modules.

## Basic Routing

Routing refers to how an application's endpoints (URIs) respond to client requests. You define routing using methods of the Express app object that correspond to HTTP methods.

```javascript
// GET method route
app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

// POST method route
app.post('/', (req, res) => {
  res.send('POST request to the homepage')
})
```

### Route Parameters

Route parameters are named URL segments used to capture values at specific positions in the URL:

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
```

Example request:
```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

### Route Handlers

You can provide multiple callback functions that behave like middleware to handle a request:

```javascript
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})
```

## Middleware

Express applications are essentially a series of middleware function calls. Middleware functions have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle.

Middleware functions can:

- Execute any code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware function in the stack

### Middleware Types

1. **Application-level middleware**:
```javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

2. **Router-level middleware**:
```javascript
const router = express.Router()

router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

3. **Error-handling middleware**:
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

4. **Built-in middleware**:
   - `express.static` - serves static assets
   - `express.json` - parses incoming requests with JSON payloads
   - `express.urlencoded` - parses incoming requests with URL-encoded payloads

5. **Third-party middleware**:
```javascript
const cookieParser = require('cookie-parser')
app.use(cookieParser())
```

## Express Router

The `express.Router` class is used to create modular, mountable route handlers:

```javascript
const express = require('express')
const router = express.Router()

// middleware specific to this router
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router
```

Usage:
```javascript
const birds = require('./birds')
app.use('/birds', birds)
```

## Response Methods

| Method           | Description                          |
|------------------|--------------------------------------|
| res.download()   | Prompt a file to be downloaded       |
| res.end()        | End the response process             |
| res.json()       | Send a JSON response                 |
| res.jsonp()      | Send a JSON response with JSONP support |
| res.redirect()   | Redirect a request                   |
| res.render()     | Render a view template               |
| res.send()       | Send a response of various types     |
| res.sendFile()   | Send a file as an octet stream       |
| res.status()     | Set the response status code         |

## Route Patterns

Express supports various route patterns including simple strings, string patterns, and regular expressions:

```javascript
// String pattern examples
app.get('/ab?cd', (req, res) => { res.send('ab?cd') })  // Matches acd or abcd
app.get('/ab+cd', (req, res) => { res.send('ab+cd') })  // Matches abcd, abbcd, abbbcd, etc.
app.get('/ab*cd', (req, res) => { res.send('ab*cd') })  // Matches abcd, abXcd, abYZcd, etc.

// Regular expression examples
app.get(/a/, (req, res) => { res.send('/a/') })         // Matches any path with an 'a' in it
app.get(/.*fly$/, (req, res) => { res.send('/.*fly$/') }) // Matches butterfly, dragonfly, etc.
```

## Chainable Route Handlers

You can create chainable route handlers using `app.route()`:

```javascript
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })
```

## Express Application Structure

A typical Express application structure might look like:

```
.
├── app.js
├── bin/
│   └── www
├── package.json
├── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
│       └── style.css
├── routes/
│   ├── index.js
│   └── users.js
└── views/
    ├── error.jade
    ├── index.jade
    └── layout.jade
```

## Error Handling

Express comes with a built-in error handler that takes care of any errors that might be encountered in the app. This default error-handling middleware is added at the end of the middleware function stack.

Custom error handling:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

## Useful Resources

- [Express Official Website](https://expressjs.com/)
- [Express GitHub Repository](https://github.com/expressjs/express)
- [Express API Reference](https://expressjs.com/en/5x/api.html)