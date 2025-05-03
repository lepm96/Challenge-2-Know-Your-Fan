'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import "./globals.css"


// URL base da API
const API_URL = 'http://localhost:5000/api'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    axios.get('http://localhost:5000/api/users')
    .then(res => console.log(res.data))
    .catch(err => console.error(err))
    
    if (token && storedUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/capa.png')] bg-center bg-cover opacity-30"></div>
        
        <div className="furia-container relative z-20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Image 
              src="/images/logo.svg" 
              alt="FURIA Logo" 
              width={250} 
              height={88} 
              className="mb-8"
            />
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              PORTAL DO FÃ <span className="text-white">FURIA</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Conecte-se com seu time favorito de CS do Brasil. Acesse conteúdos exclusivos, 
              estatísticas em tempo real e interaja com nosso bot inteligente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/profile">
                    <Button className="bg-white text-black hover:bg-white/80 px-8 py-6 text-lg">
                      Meu Perfil
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg">
                      Chat Bot
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-white text-black hover:bg-white/80 px-8 py-6 text-lg">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg">
                      Cadastre-se
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="furia-container">
          <h2 className="text-3xl font-bold mb-12 text-center">Recursos Exclusivos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Análise de Interações</h3>
              <p className="text-gray-400">
                Analisamos suas interações nas redes sociais da FURIA para personalizar sua experiência 
                e oferecer conteúdos relevantes.
              </p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Chat Bot Inteligente</h3>
              <p className="text-gray-400">
                Converse com nosso bot para descobrir curiosidades, ver a agenda de jogos, 
                estatísticas dos jogadores e muito mais!
              </p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Conteúdo Exclusivo</h3>
              <p className="text-gray-400">
                Acesse conteúdos exclusivos, promoções especiais e participe de quizzes 
                para testar seu conhecimento sobre a FURIA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/5">
        <div className="furia-container text-center">
          <h2 className="text-3xl font-bold mb-4">Junte-se à Comunidade FURIA</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Faça parte da maior comunidade de fãs da FURIA e tenha acesso a recursos exclusivos.
          </p>
          
          {isLoggedIn ? (
            <Link href="/chat">
              <Button className="bg-white text-black hover:bg-white/80 px-8 py-6 text-lg">
                Conversar com o Bot
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-white/80 px-8 py-6 text-lg">
                Cadastre-se Agora
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-800">
        <div className="furia-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image 
                src="/images/logo.svg" 
                alt="FURIA Logo" 
                width={120} 
                height={42} 
              />
            </div>
            
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} FURIA Esports. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
