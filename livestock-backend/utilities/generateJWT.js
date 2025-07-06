const jwt = require('jsonwebtoken');

const generateJWT = (user) => {
  try {
    const userId = user.id || user.userId;
    if (!user.id) {
      throw new Error('User ID is required for JWT generation');
    }
    
    const payload = {
      userId,       
      email: user.email,      
      role: user.role         
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  } catch (err) {
    console.error('JWT Generation Error:', err);
    throw new Error('Error generating token');
  }
};

module.exports = generateJWT;