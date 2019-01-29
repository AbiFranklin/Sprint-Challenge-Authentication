const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig')

const { authenticate } = require('../auth/authenticate');
const secret = 'secretsecret';

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;
    

    db('users')
    .insert(creds)
    .then(ids => {
        const id = ids[0];

        db('users')
        .where({ id })
        .first()
        .then(user => {
            const payload = {
                username: user.username
            };
            const options = {
                expiresIn: '1h',
                jwtid: '12345'
            };
            const token = jwt.sign(payload, secret, options);
            res.status(201).json({ id: user.id, token })
        })
        .catch(err => res.status(500).send(err));
    })
    .catch(err => res.status(500).send(err));
}

function login(req, res) {
    const creds = req.body;
    db('users').where( { username: creds.username }).first()
    .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
            const payload = {
                username: user.username
            };
            const options = {
                expiresIn: '1h',
                jwtid: '12345'
            };
            const token = jwt.sign(payload, secret, options);
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Login Error' });
        }
    })
    .catch(err => res.status(500).send(err));
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