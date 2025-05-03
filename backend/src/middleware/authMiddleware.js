const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token está no header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Obter token do header
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar se o token existe
    if (!token) {
      return res.status(401).json({ success: false, message: 'Não autorizado, token não fornecido' });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'furia_secret_key');

      // Obter usuário do token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Não autorizado, token inválido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

module.exports = { protect };
