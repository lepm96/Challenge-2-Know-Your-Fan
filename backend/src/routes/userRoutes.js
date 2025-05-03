const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/login', loginUser);
router.post('/register', registerUser);  // Remover duplicata

// Rotas protegidas
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Rota para listar todos os usuários (exemplo)
router.get('/', (req, res) => {
  res.json([{ id: 1, nome: 'Fulano' }, { id: 2, nome: 'Ciclano' }]);
});

module.exports = router;
