const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// @desc    Obter histórico de mensagens do usuário
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    // Buscar o histórico de chat do usuário
    let chatHistory = await ChatMessage.findOne({ user: req.user.id });
    
    // Se não existir, retornar um array vazio
    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    res.status(200).json({
      success: true,
      messages: chatHistory.messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// @desc    Enviar mensagem para o chatbot
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Mensagem não pode estar vazia' });
    }

    // Buscar ou criar histórico de chat do usuário
    let chatHistory = await ChatMessage.findOne({ user: req.user.id });
    
    if (!chatHistory) {
      chatHistory = new ChatMessage({
        user: req.user.id,
        messages: []
      });
    }

    // Adicionar mensagem do usuário
    chatHistory.messages.push({
      content: message,
      role: 'user'
    });

    // Gerar resposta do bot
    const botResponse = await generateBotResponse(message, req.user.id);
    
    // Adicionar resposta do bot
    chatHistory.messages.push({
      content: botResponse,
      role: 'bot'
    });

    // Atualizar timestamp
    chatHistory.updatedAt = Date.now();
    
    // Salvar histórico atualizado
    await chatHistory.save();

    res.status(200).json({
      success: true,
      response: botResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// @desc    Limpar histórico de chat do usuário
// @route   DELETE /api/chat/history
// @access  Private
const clearChatHistory = async (req, res) => {
  try {
    // Remover histórico de chat do usuário
    await ChatMessage.findOneAndDelete({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Histórico de chat limpo com sucesso'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

// Função para gerar resposta do bot baseada na mensagem do usuário
const generateBotResponse = async (message, userId) => {
  // Buscar informações do usuário para personalizar respostas
  const user = await User.findById(userId);
  
  // Converter mensagem para minúsculas para facilitar a comparação
  const lowerMessage = message.toLowerCase();
  
  // Respostas baseadas no conteúdo da mensagem
  if (lowerMessage.includes('curiosidade') || lowerMessage.includes('história') || lowerMessage.includes('sobre o time')) {
    return `A FURIA Esports foi fundada em 2017 e rapidamente se tornou um dos principais times de CS do Brasil. O time é conhecido por seu estilo agressivo e inovador de jogo, liderado pelo capitão arT. Quer saber mais alguma curiosidade específica?`;
  } 
  else if (lowerMessage.includes('origem') || lowerMessage.includes('fundação') || lowerMessage.includes('fundador')) {
    return `A FURIA Esports foi fundada em 2017 por Jaime "raizen" Pádua e André Akkari, um jogador profissional de poker. Desde então, a organização cresceu para se tornar uma das mais importantes do cenário de esports brasileiro.`;
  } 
  else if (lowerMessage.includes('logo') || lowerMessage.includes('símbolo') || lowerMessage.includes('pantera')) {
    return `O logo da FURIA representa uma pantera negra, simbolizando força, agilidade e precisão - características essenciais para jogadores de CS. A pantera negra também simboliza diversidade e poder.`;
  } 
  else if (lowerMessage.includes('agenda') || lowerMessage.includes('próximo jogo') || lowerMessage.includes('quando') || lowerMessage.includes('próximos jogos')) {
    return `Os próximos jogos da FURIA são:\n\n• 28/04/2025 - FURIA vs. Liquid - ESL Pro League - 15:00\n• 30/04/2025 - FURIA vs. NAVI - BLAST Premier - 13:30\n• 05/05/2025 - FURIA vs. Cloud9 - IEM Cologne - 17:00\n\nQuer que eu te lembre antes dos jogos começarem?`;
  } 
  else if (lowerMessage.includes('resultado') || lowerMessage.includes('ganhou') || lowerMessage.includes('perdeu') || lowerMessage.includes('últimos jogos')) {
    return `Resultados recentes da FURIA:\n\n• 20/04/2025 - FURIA 16 x 10 MIBR - ESL Pro League - Vitória\n• 18/04/2025 - FURIA 13 x 16 G2 - BLAST Premier - Derrota\n• 15/04/2025 - FURIA 16 x 8 Complexity - IEM Katowice - Vitória\n\nO time está em boa fase, com 2 vitórias nos últimos 3 jogos!`;
  } 
  else if (lowerMessage.includes('clip') || lowerMessage.includes('melhores momentos') || lowerMessage.includes('jogada')) {
    return `Temos vários clips incríveis para você! Aqui estão alguns dos mais populares:\n\n• Clutch incrível do arT contra a NAVI - 125K visualizações\n• Ace do KSCERATO contra NAVI - 98K visualizações\n• Jogada estratégica perfeita contra Liquid - 76K visualizações\n\nQual deles você gostaria de assistir?`;
  } 
  else if (lowerMessage.includes('estatística') || lowerMessage.includes('jogador') || lowerMessage.includes('melhor jogador') || lowerMessage.includes('stats')) {
    // Personalizar resposta se o usuário tiver um jogador favorito
    let favoritePlayerResponse = '';
    if (user && user.favoritePlayer) {
      favoritePlayerResponse = `\n\nVi que seu jogador favorito é ${user.favoritePlayer}. Ele tem se destacado bastante nos últimos jogos!`;
    }
    
    return `Estatísticas atuais dos jogadores da FURIA:\n\n• arT (Capitão/Entry Fragger): K/D 1.15, HS% 62%, Rating 1.18\n• KSCERATO (Rifler): K/D 1.32, HS% 58%, Rating 1.25\n• yuurih (Rifler/Support): K/D 1.21, HS% 55%, Rating 1.20\n\nKSCERATO é atualmente o jogador com melhor rating da equipe. Quer saber mais sobre algum jogador específico?${favoritePlayerResponse}`;
  } 
  else if (lowerMessage.includes('loja') || lowerMessage.includes('comprar') || lowerMessage.includes('camiseta') || lowerMessage.includes('produto')) {
    return `Nossa loja tem vários produtos oficiais da FURIA! Destaques:\n\n• Camiseta Oficial FURIA 2025 - R$ 359,00 (10% de desconto)\n• Moletom FURIA Preto - R$ 429,00\n• Boné FURIA Snapback - R$ 159,00 (15% de desconto)\n\nUse o cupom FURIA10 para ganhar 10% de desconto em qualquer compra. Posso te mostrar mais produtos?`;
  } 
  else if (lowerMessage.includes('quiz') || lowerMessage.includes('desafio') || lowerMessage.includes('teste')) {
    return `Temos vários quizzes para testar seu conhecimento sobre a FURIA!\n\n• História da FURIA - 10 perguntas - Dificuldade: Médio\n• Jogadores e Estatísticas - 15 perguntas - Dificuldade: Difícil\n• Conquistas e Torneios - 8 perguntas - Dificuldade: Fácil\n\nQual deles você gostaria de começar? Ou prefere que eu faça uma pergunta aleatória para testar seu conhecimento?`;
  } 
  else if (lowerMessage.includes('conquista') || lowerMessage.includes('título') || lowerMessage.includes('campeonato')) {
    return `A FURIA já conquistou diversos títulos importantes, incluindo:\n\n• BLAST Premier: Spring 2020 American Finals\n• ESL Pro League Season 12: North America\n• ESEA Season 36: Premier Division - North America\n• DreamHack Open Summer 2020: North America\n\nO time continua em busca do seu primeiro Major Championship, que é o título mais prestigiado do CS.`;
  } 
  else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('e aí')) {
    // Personalizar saudação com o nome do usuário
    const greeting = user && user.name ? `Olá, ${user.name}!` : 'Olá!';
    return `${greeting} Sou o bot da FURIA, estou aqui para te ajudar com informações sobre o time, jogos, produtos e muito mais. Você pode me perguntar sobre curiosidades, agenda de jogos, estatísticas dos jogadores, produtos da loja ou participar de quizzes. Como posso te ajudar hoje?`;
  } 
  else if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu') || lowerMessage.includes('thanks')) {
    return `Por nada! Estou sempre aqui para ajudar os fãs da FURIA. Se precisar de mais alguma coisa, é só perguntar! #GOFURIA`;
  } 
  else if (lowerMessage.includes('jogadores') || lowerMessage.includes('elenco') || lowerMessage.includes('time atual')) {
    return `O elenco atual da FURIA de CS é composto por:\n\n• Andrei "arT" Piovezan (Capitão/Entry Fragger)\n• Kaike "KSCERATO" Cerato (Rifler)\n• Yuri "yuurih" Santos (Rifler/Support)\n• Rafael "saffee" Costa (AWPer)\n• André "drop" Abreu (Support)\n\nO técnico é Nicholas "guerri" Nogueira. Quer saber mais sobre algum jogador específico?`;
  } 
  else if (lowerMessage.includes('cupom') || lowerMessage.includes('desconto') || lowerMessage.includes('promoção')) {
    return `Tenho um cupom exclusivo para você! Use o código FURIA10 para ganhar 10% de desconto em qualquer compra na loja oficial da FURIA. Aproveite para garantir os produtos oficiais do seu time favorito!`;
  }
  else {
    return `Desculpe, não entendi sua pergunta. Você pode me perguntar sobre curiosidades do time, agenda de jogos, estatísticas dos jogadores, produtos da loja ou participar de quizzes e desafios!`;
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  clearChatHistory
};
