const express = require('express');
const expressApp = express();
const mySqlApp = require('mysql');
const corsApp = require('cors');
const crypto = require('crypto');
expressApp.use([express.json(), corsApp()]);

// Login Constants
const HOST = '127.0.0.1';
const USERNAME = 'auth';
const PASSWORD = 'A&e@1RbTU2yIz!:LOm!j';
const DATABASE = 'user';

expressApp.get('/user/:id', (req, res) => {getUser(req, res)});
expressApp.get('/user', (req, res) => {getAllUsers(req, res)});
expressApp.post('/user', (req, res) => {registerUser(req, res)});
expressApp.put('/user/:id', (req, res) => {updateUser(req, res)});
expressApp  .delete('/user/:id', (req, res) => {deleteUser(req, res)});

/**
 * Gets a single user using their email as the id.
 * @param {*} req The request values given by the user to the API. Is used in
 * this context to get the email from the url query parameters
 * @param {*} res The response values given by the API to the user. Is used in
 * this context to response with either the internal query error or the results
 * of the query
 */
function getUser(req, res) {
  
  const {id} = req.params;
  
  console.log(`GET: id - ${id}`);
  
  const queryString = 'SELECT * FROM user WHERE email = ? OR username = ?';
  
  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: [id, id]
    
  }, (error, results, fields) => {
    
    if (error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

/**
 * Gets all users registered into the user db.
 * @param {*} req The request values given by the user to the API. Not used in
 * this context.
 * @param {*} res The response values given by the API to the user. Is used in
 * this context to response with either the internal query error or the results
 * of the query
 */
function getAllUsers(req, res) {
  
  console.log(`GET ALL`);
  
  const queryString = 'SELECT * FROM user';
  
  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000
    
  }, (error, results, fields) => {
    
    if (error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function registerUser(req, res) {
  
  const queryString = 'INSERT INTO user (email, username, password, type, salt) VALUES (?, ?, ?, ?, ?)';
  
  let queryItems = [];
  
  const {email, username, password, type} = req.body;
  
  console.log(`POST: email - ${email}, username  - ${username}, password - ${password}, type - ${type}`);
  
  let passwordResults = encryptPassword(password);
  
  queryItems[0] = email;
  queryItems[1] = username;
  queryItems[2] = passwordResults['hash'];
  queryItems[3] = type;
  queryItems[4] = passwordResults['salt'];
  
  console.log(`email: ${queryItems[0]}, username: ${queryItems[1]}, password: ${queryItems[2]}, type: ${type}`);
  
  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: queryItems
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function encryptPassword(password) {
  let passwordSalt = crypto.randomBytes(64).toString('base64');
  let passwordHash = crypto.pbkdf2Sync(password, passwordSalt, 120000, 64, 'sha512').toString('base64');
  console.log(passwordHash);
  return {
    salt: passwordSalt,
    hash: passwordHash
  }
}

function updateUser(req, res) {
  
  const {id} = req.params;
  
  let queryString = 'UPDATE user SET ';
  
  let queryItems = [];
  
  const {email, username, password, type} = req.body;
  
  console.log(`PUT: old_email - ${id}, email - ${email}, username  - ${username}, password - ${password}, type - ${type}`);
  
  if(email != null) {
    queryString += 'email = ?, ';
    queryItems.push(email);
  }
  
  if(username != null) {
    queryString += 'username = ?, ';
    queryItems.push(username);
  }
  
  if(password != null) {
    queryString += 'password = ?, salt = ?, ';
    let passwordResults = encryptPassword(password);
    queryItems.push(passwordResults['hash']);
    queryItems.push(passwordResults['salt']);
  }
  
  if(type != null) {
    queryString += 'type = ?, ';
    queryItems.push(type);
  }
  
  let updatedQueryString = queryString.substring(0, queryString.length - 2);
  
  updatedQueryString += ' WHERE email = ?  OR username = ?';
  
  queryItems.push(id);
  
  queryItems.push(id);
  
  connectionPool.query({
    
    sql: updatedQueryString,
    
    timeout: 40000,
    
    values: queryItems
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

function deleteUser(req, res) {
  
  const {id} = req.params;
  
  console.log(`DELETE: id - ${id}`);
  
  const queryString = 'DELETE FROM user WHERE email = ? OR username = ?';
  
  connectionPool.query({
    
    sql: queryString,
    
    timeout: 40000,
    
    values: [id, id]
    
  },(error, results, fields) => {
    
    if(error) {
      
      res.status(500).send("Internal query error");
      
      return console.error(error.message);
    }
    
    res.status(200).send(results);
  });
}

// Setting up the Auth server and the connection pool
expressApp.on('exit', () => {
  connectionPool.end((error) => {
    return console.error(error.message);
  });
});

expressApp.listen(
  5000,
  (error) => {
    
    if(error) console.error(error);
    
    connectionPool = mySqlApp.createPool({
      connectionLimit: 50,
      host: HOST,
      user: USERNAME,
      password: PASSWORD,
      database: DATABASE
    });
    
  }
);