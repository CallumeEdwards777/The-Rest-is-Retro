const jwt = require('jsonwebtoken');

// Set JWT_SECRET in the server environment file. The fallback keeps local dev
// working, but anyone reading this repo can forge tokens signed with it.
const secret = process.env.JWT_SECRET || 'mysecretssshhhhhhh';
const expiration = '2h';

const authMiddleware = (req, res, next) => {

  let token = req.body.token || req.headers.authorization;
  console.log('token: ' + token);

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    res.status(400).json({ message: 'Bearer Token not supplied or invalid' });
    return;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (err) {
    console.log('Invalid token');
    res.status(400).json({ message: 'Invalid token: ' + err.message });
  }

  return req;
}

const signToken = (user) => {

  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = { authMiddleware, signToken };