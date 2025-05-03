'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

// URL base da API
const API_URL = 'http://localhost:5000/api'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)

  // Função para rolar para o final da conversa
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      fetchChatHistory(storedToken)
    } else {
      // Adicionar mensagem inicial se não houver histórico
      setMessages([
        { 
          role: 'bot', 
          content: 'Olá! Sou o bot da FURIA. Como posso ajudar você hoje? Você pode me perguntar sobre curiosidades do time, agenda de jogos, estatísticas dos jogadores, produtos da loja, ou participar de quizzes e desafios!' 
        }
      ])
    }
  }, [])

  // Buscar histórico de chat do usuário
  const fetchChatHistory = async (authToken) => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
      
      const response = await axios.get(`${API_URL}/chat/history`, config)
      
      if (response.data.success && response.data.messages.length > 0) {
        setMessages(response.data.messages)
      } else {
        // Adicionar mensagem inicial se não houver histórico
        setMessages([
          { 
            role: 'bot', 
            content: `Olá${user ? ', ' + user.name : ''}! Sou o bot da FURIA. Como posso ajudar você hoje? Você pode me perguntar sobre curiosidades do time, agenda de jogos, estatísticas dos jogadores, produtos da loja, ou participar de quizzes e desafios!` 
          }
        ])
      }
    } catch (error) {
      console.error('Erro ao buscar histórico de chat:', error)
      // Adicionar mensagem inicial em caso de erro
      setMessages([
        { 
          role: 'bot', 
          content: 'Olá! Sou o bot da FURIA. Como posso ajudar você hoje? Você pode me perguntar sobre curiosidades do time, agenda de jogos, estatísticas dos jogadores, produtos da loja, ou participar de quizzes e desafios!' 
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Função para processar a mensagem do usuário
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Adiciona a mensagem do usuário localmente
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      if (token) {
        // Enviar mensagem para o backend se o usuário estiver autenticado
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        
        const response = await axios.post(`${API_URL}/chat/message`, { message: input }, config)
        
        if (response.data.success) {
          // Adicionar resposta do bot
          const botMessage = { role: 'bot', content: response.data.response }
          setMessages(prev => [...prev, botMessage])
        }
      } else {
        // Simulação de resposta para usuários não autenticados
        setTimeout(() => {
          let botResponse = { role: 'bot', content: 'Desculpe, não entendi sua pergunta. Pode reformular?' }
          
          const lowerInput = input.toLowerCase()
          
          if (lowerInput.includes('curiosidade') || lowerInput.includes('história') || lowerInput.includes('sobre o time')) {
            botResponse = { 
              role: 'bot', 
              content: 'A FURIA Esports foi fundada em 2017 e rapidamente se tornou um dos principais times de CS do Brasil. O time é conhecido por seu estilo agressivo e inovador de jogo, liderado pelo capitão arT. Quer saber mais alguma curiosidade específica?' 
            }
          } else if (lowerInput.includes('origem') || lowerInput.includes('fundação') || lowerInput.includes('fundador')) {
            botResponse = { 
              role: 'bot', 
              content: 'A FURIA Esports foi fundada em 2017 por Jaime "raizen" Pádua e André Akkari, um jogador profissional de poker. Desde então, a organização cresceu para se tornar uma das mais importantes do cenário de esports brasileiro.' 
            }
          } else if (lowerInput.includes('logo') || lowerInput.includes('símbolo') || lowerInput.includes('pantera')) {
            botResponse = { 
              role: 'bot', 
              content: 'O logo da FURIA representa uma pantera negra, simbolizando força, agilidade e precisão - características essenciais para jogadores de CS. A pantera negra também simboliza diversidade e poder.' 
            }
          } else if (lowerInput.includes('agenda') || lowerInput.includes('próximo jogo') || lowerInput.includes('quando') || lowerInput.includes('próximos jogos')) {
            botResponse = { 
              role: 'bot', 
              content: 'Os próximos jogos da FURIA são:\n\n• 28/04/2025 - FURIA vs. Liquid - ESL Pro League - 15:00\n• 30/04/2025 - FURIA vs. NAVI - BLAST Premier - 13:30\n• 05/05/2025 - FURIA vs. Cloud9 - IEM Cologne - 17:00\n\nQuer que eu te lembre antes dos jogos começarem?' 
            }
          } else if (lowerInput.includes('resultado') || lowerInput.includes('ganhou') || lowerInput.includes('perdeu') || lowerInput.includes('últimos jogos')) {
            botResponse = { 
              role: 'bot', 
              content: 'Resultados recentes da FURIA:\n\n• 20/04/2025 - FURIA 16 x 10 MIBR - ESL Pro League - Vitória\n• 18/04/2025 - FURIA 13 x 16 G2 - BLAST Premier - Derrota\n• 15/04/2025 - FURIA 16 x 8 Complexity - IEM Katowice - Vitória\n\nO time está em boa fase, com 2 vitórias nos últimos 3 jogos!' 
            }
          } else if (lowerInput.includes('clip') || lowerInput.includes('melhores momentos') || lowerInput.includes('jogada')) {
            botResponse = { 
              role: 'bot', 
              content: 'Temos vários clips incríveis para você! Aqui estão alguns dos mais populares:\n\n• Clutch incrível do arT contra a NAVI - 125K visualizações\n• Ace do KSCERATO contra NAVI - 98K visualizações\n• Jogada estratégica perfeita contra Liquid - 76K visualizações\n\nQual deles você gostaria de assistir?' 
            }
          } else if (lowerInput.includes('estatística') || lowerInput.includes('jogador') || lowerInput.includes('melhor jogador') || lowerInput.includes('stats')) {
            botResponse = { 
              role: 'bot', 
              content: 'Estatísticas atuais dos jogadores da FURIA:\n\n• arT (Capitão/Entry Fragger): K/D 1.15, HS% 62%, Rating 1.18\n• KSCERATO (Rifler): K/D 1.32, HS% 58%, Rating 1.25\n• yuurih (Rifler/Support): K/D 1.21, HS% 55%, Rating 1.20\n\nKSCERATO é atualmente o jogador com melhor rating da equipe. Quer saber mais sobre algum jogador específico?' 
            }
          } else if (lowerInput.includes('loja') || lowerInput.includes('comprar') || lowerInput.includes('camiseta') || lowerInput.includes('produto')) {
            botResponse = { 
              role: 'bot', 
              content: 'Nossa loja tem vários produtos oficiais da FURIA! Destaques:\n\n• Camiseta Oficial FURIA 2025 - R$ 359,00 (10% de desconto)\n• Moletom FURIA Preto - R$ 429,00\n• Boné FURIA Snapback - R$ 159,00 (15% de desconto)\n\nUse o cupom FURIA10 para ganhar 10% de desconto em qualquer compra. Posso te mostrar mais produtos?' 
            }
          } else if (lowerInput.includes('quiz') || lowerInput.includes('desafio') || lowerInput.includes('teste')) {
            botResponse = { 
              role: 'bot', 
              content: 'Temos vários quizzes para testar seu conhecimento sobre a FURIA!\n\n• História da FURIA - 10 perguntas - Dificuldade: Médio\n• Jogadores e Estatísticas - 15 perguntas - Dificuldade: Difícil\n• Conquistas e Torneios - 8 perguntas - Dificuldade: Fácil\n\nQual deles você gostaria de começar? Ou prefere que eu faça uma pergunta aleatória para testar seu conhecimento?' 
            }
          } else if (lowerInput.includes('conquista') || lowerInput.includes('título') || lowerInput.includes('campeonato')) {
            botResponse = { 
              role: 'bot', 
              content: 'A FURIA já conquistou diversos títulos importantes, incluindo:\n\n• BLAST Premier: Spring 2020 American Finals\n• ESL Pro League Season 12: North America\n• ESEA Season 36: Premier Division - North America\n• DreamHack Open Summer 2020: North America\n\nO time continua em busca do seu primeiro Major Championship, que é o título mais prestigiado do CS.' 
            }
          } else if (lowerInput.includes('oi') || lowerInput.includes('olá') || lowerInput.includes('e aí')) {
            botResponse = { 
              role: 'bot', 
              content: 'Olá! Sou o bot da FURIA, estou aqui para te ajudar com informações sobre o time, jogos, produtos e muito mais. Você pode me perguntar sobre curiosidades, agenda de jogos, estatísticas dos jogadores, produtos da loja ou participar de quizzes. Como posso te ajudar hoje?' 
            }
          } else if (lowerInput.includes('obrigado') || lowerInput.includes('valeu') || lowerInput.includes('thanks')) {
            botResponse = { 
              role: 'bot', 
              content: 'Por nada! Estou sempre aqui para ajudar os fãs da FURIA. Se precisar de mais alguma coisa, é só perguntar! #GOFURIA' 
            }
          } else if (lowerInput.includes('jogadores') || lowerInput.includes('elenco') || lowerInput.includes('time atual')) {
            botResponse = { 
              role: 'bot', 
              content: 'O elenco atual da FURIA de CS é composto por:\n\n• Andrei "arT" Piovezan (Capitão/Entry Fragger)\n• Kaike "KSCERATO" Cerato (Rifler)\n• Yuri "yuurih" Santos (Rifler/Support)\n• Rafael "saffee" Costa (AWPer)\n• André "drop" Abreu (Support)\n\nO técnico é Nicholas "guerri" Nogueira. Quer saber mais sobre algum jogador específico?' 
            }
          } else if (lowerInput.includes('cupom') || lowerInput.includes('desconto') || lowerInput.includes('promoção')) {
            botResponse = { 
              role: 'bot', 
              content: 'Tenho um cupom exclusivo para você! Use o código FURIA10 para ganhar 10% de desconto em qualquer compra na loja oficial da FURIA. Aproveite para garantir os produtos oficiais do seu time favorito!' 
            }
          } else if (lowerInput.includes('login') || lowerInput.includes('cadastro') || lowerInput.includes('conta')) {
            botResponse = { 
              role: 'bot', 
              content: 'Para ter uma experiência personalizada e acessar recursos exclusivos, você pode fazer login ou se cadastrar na nossa plataforma. Isso permitirá que eu salve suas preferências e ofereça conteúdo mais relevante para você. Deseja fazer login agora?' 
            }
          }
          
          setMessages(prev => [...prev, botResponse])
          setLoading(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      // Adicionar mensagem de erro
      const errorMessage = { 
        role: 'bot', 
        content: 'Desculpe, tive um problema ao processar sua mensagem. Por favor, tente novamente mais tarde.' 
      }
      setMessages(prev => [...prev, errorMessage])
      setLoading(false)
    }
  }

  // Função para limpar o histórico de chat
  const handleClearChat = async () => {
    if (token) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        
        await axios.delete(`${API_URL}/chat/history`, config)
      } catch (error) {
        console.error('Erro ao limpar histórico:', error)
      }
    }
    
    // Resetar mensagens localmente
    setMessages([
      { 
        role: 'bot', 
        content: `Olá${user ? ', ' + user.name : ''}! Sou o bot da FURIA. Como posso ajudar você hoje? Você pode me perguntar sobre curiosidades do time, agenda de jogos, estatísticas dos jogadores, produtos da loja, ou participar de quizzes e desafios!` 
      }
    ])
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4">
        <div className="furia-container flex justify-between items-center">
          <Link href="/">
            <Image 
              src="/images/furia_logo.svg+xml" 
              alt="FURIA Logo" 
              width={120} 
              height={42} 
            />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Meu Perfil
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="furia-container py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Bot da FURIA</h1>
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Converse com o bot da FURIA para descobrir curiosidades, ver a agenda de jogos, 
          estatísticas dos jogadores, produtos da loja e muito mais!
        </p>

        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            className="text-sm border-gray-700 text-gray-400 hover:bg-gray-800"
            onClick={handleClearChat}
          >
            Limpar Conversa
          </Button>
        </div>

        <Card className="furia-card bg-white/5 border-gray-800 max-w-3xl mx-auto h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 mr-2 flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/furia_panther_logo.jpeg" 
                        alt="FURIA Bot" 
                        width={32} 
                        height={32} 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                      message.role === 'user' 
                        ? 'bg-white text-black' 
                        : 'bg-gray-800 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="furia-input bg-black/50 border-gray-700 text-white"
                disabled={loading}
              />
              <Button 
                type="submit" 
                className="bg-white text-black hover:bg-white/80"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </div>
        </Card>
        
        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Experimente perguntar sobre: curiosidades do time, agenda de jogos, estatísticas dos jogadores, 
            produtos da loja, ou participar de quizzes e desafios!
          </p>
          {!token && (
            <p className="text-gray-400 text-sm mt-2">
              <Link href="/login" className="text-white underline">Faça login</Link> ou <Link href="/register" className="text-white underline">cadastre-se</Link> para ter uma experiência personalizada!
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
