const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'furia_secret_key', {
    expiresIn: '30d'
  });
};

// @desc    Autenticar usuário e gerar token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, informe email e senha' });
    }

    // Verificar se o usuário existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Verificar se a senha está correta
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    // Retornar token e dados do usuário
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// @desc    Registrar novo usuário
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      confirmPassword,
      birthDate,
      city,
      instagram,
      twitter,
      facebook,
      favoritePlayer,
      followingSince
    } = req.body;

    // Verificar se o email já está em uso
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Este email já está em uso' });
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'As senhas não coincidem' });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      birthDate,
      city,
      socialMedia: {
        instagram,
        twitter,
        facebook
      },
      favoritePlayer,
      followingSince
    });

    // Retornar token e dados do usuário
    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Dados de usuário inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        city: user.city,
        socialMedia: user.socialMedia,
        favoritePlayer: user.favoritePlayer,
        followingSince: user.followingSince,
        engagementLevel: user.engagementLevel,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Atualizar campos
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.birthDate) user.birthDate = req.body.birthDate;
    if (req.body.city) user.city = req.body.city;
    
    // Atualizar redes sociais
    if (req.body.instagram) user.socialMedia.instagram = req.body.instagram;
    if (req.body.twitter) user.socialMedia.twitter = req.body.twitter;
    if (req.body.facebook) user.socialMedia.facebook = req.body.facebook;
    
    if (req.body.favoritePlayer) user.favoritePlayer = req.body.favoritePlayer;
    if (req.body.followingSince) user.followingSince = req.body.followingSince;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        birthDate: updatedUser.birthDate,
        city: updatedUser.city,
        socialMedia: updatedUser.socialMedia,
        favoritePlayer: updatedUser.favoritePlayer,
        followingSince: updatedUser.followingSince
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  generateToken
};
