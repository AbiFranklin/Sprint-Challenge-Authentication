const jwt = require('jsonwebtoken');

const secret = 'secretsecret';

// quickly see what this file exports
module.exports = {
  authenticate
};

// implementation details
function authenticate(req, res, next) {
const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).json(err);

      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({
      error: 'No token provided, must be set on the Authorization Header',
    });
  }
}

