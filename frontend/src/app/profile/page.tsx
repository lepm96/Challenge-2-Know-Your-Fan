'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// URL base da API
const API_URL = 'http://localhost:5000/api'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [interactions, setInteractions] = useState({
    likes: 42,
    comments: 15,
    shares: 8,
    engagementLevel: 78
  })
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    
    if (!storedToken) {
      router.push('/login')
      return
    }
    
    setToken(storedToken)
    fetchUserProfile(storedToken)
  }, [router])

  const fetchUserProfile = async (authToken) => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
      
      const response = await axios.get(`${API_URL}/users/profile`, config)
      
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        setError('Erro ao carregar perfil')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setError('Erro ao carregar perfil. Por favor, faça login novamente.')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setTimeout(() => router.push('/login'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Carregando perfil...</h1>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Erro</h1>
          <p className="text-red-400">{error}</p>
          <p className="mt-4">Redirecionando para a página de login...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4">
        <div className="furia-container flex justify-between items-center">
          <Link href="/">
            <Image 
              src="/images/logo.svg" 
              alt="FURIA Logo" 
              width={120} 
              height={42} 
            />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Chat Bot
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="furia-container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* User Info Card */}
          <Card className="furia-card bg-white/5 border-gray-800 p-6 md:w-1/3">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image 
                  src="/images/Furia_Esports_logo.png" 
                  alt="Profile" 
                  width={128} 
                  height={128} 
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold">{user?.name || 'Fã da FURIA'}</h1>
              <p className="text-gray-400">{user?.city || 'São Paulo, SP'}</p>
              <p className="text-sm text-gray-500">Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="mb-6">
              <div className="mb-2">
                <p className="text-gray-400">Nível de Engajamento</p>
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-white h-2.5 rounded-full" 
                    style={{ width: `${interactions.engagementLevel}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500">{interactions.engagementLevel}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 text-center">
              <div>
                <p className="text-2xl font-bold">{interactions.likes}</p>
                <p className="text-sm text-gray-400">Curtidas</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{interactions.comments}</p>
                <p className="text-sm text-gray-400">Comentários</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{interactions.shares}</p>
                <p className="text-sm text-gray-400">Compartilhamentos</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h2 className="text-lg font-bold mb-4">Redes Sociais</h2>
              <div className="space-y-2">
                {user?.socialMedia?.instagram && (
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-2">IG</span>
                    <span className="text-gray-400">@{user.socialMedia.instagram}</span>
                  </div>
                )}
                {user?.socialMedia?.twitter && (
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-2">X</span>
                    <span className="text-gray-400">@{user.socialMedia.twitter}</span>
                  </div>
                )}
                {user?.socialMedia?.facebook && (
                  <div className="flex items-center">
                    <span className="text-white font-bold mr-2">FB</span>
                    <span className="text-gray-400">{user.socialMedia.facebook}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Analysis Card */}
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Button className="bg-white/10 hover:bg-white/20 text-white">Análise de Interações</Button>
              <Button className="bg-white/5 hover:bg-white/20 text-white">Estatísticas</Button>
              <Button className="bg-white/5 hover:bg-white/20 text-white">Eventos Recentes</Button>
            </div>

            <Card className="furia-card bg-white/5 border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-6">Análise de Interações nas Redes Sociais</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Resumo de Engajamento</h3>
                <p className="text-gray-300 mb-4">
                  Com base na análise das suas interações com a FURIA nas redes sociais, você demonstra um alto nível de engajamento com o time. Sua última interação foi em 24/04/2025.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Tipo de Conteúdo Preferido</h4>
                    <p className="text-gray-300">Notícias sobre vitórias e campeonatos</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Horário de Maior Atividade</h4>
                    <p className="text-gray-300">Entre 19h e 22h</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Jogador Mais Mencionado</h4>
                    <p className="text-gray-300">{user?.favoritePlayer || 'arT'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Interações Recentes</h3>
                
                <div className="space-y-4">
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-white/10 text-sm px-2 py-1 rounded">Curtida</span>
                      <span className="text-gray-400 text-sm">20/04/2025</span>
                    </div>
                    <p className="text-gray-300">FURIA vence mais um campeonato!</p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-white/10 text-sm px-2 py-1 rounded">Comentário</span>
                      <span className="text-gray-400 text-sm">18/04/2025</span>
                    </div>
                    <p className="text-gray-300">Melhor time do Brasil!</p>
                  </div>
                  
                  <div className="border border-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-white/10 text-sm px-2 py-1 rounded">Compartilhamento</span>
                      <span className="text-gray-400 text-sm">15/04/2025</span>
                    </div>
                    <p className="text-gray-300">Nova coleção de camisetas FURIA</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
