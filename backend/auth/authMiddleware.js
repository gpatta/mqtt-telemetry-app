import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // Load environment variables

export const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
};
