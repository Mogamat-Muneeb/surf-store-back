const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  if(!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded._id;
    req.cart = decoded.cart;
    next();
  });
};


module.exports = verifyToken;