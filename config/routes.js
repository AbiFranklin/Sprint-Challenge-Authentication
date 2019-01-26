const axios = require('axios');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const knexConfig = require('../knexfile.js');

const db = knex(knexConfig.development);

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  db('users').insert(user)
  .then(user => {
      res.status(201).send('Successfully Registered!')
  })
  .catch(err => {
    res.status(500).send(err);
  })
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
