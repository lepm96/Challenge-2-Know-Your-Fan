'use client'
import { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

// URL base da API
const API_URL = 'http://localhost:5000/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password
      })

      if (response.data.success) {
        // Armazenar token e dados do usuário
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirecionar para a página de perfil
        router.push('/profile')
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setError(
        error.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="furia-container py-16 flex flex-col items-center justify-center">
        <Link href="/" className="mb-8">
          <Image 
            src="/images/logo.svg" 
            alt="FURIA Logo" 
            width={150} 
            height={53} 
          />
        </Link>

        <h1 className="text-4xl font-bold mb-2 text-center">PORTAL DO FÃ FURIA</h1>
        <p className="text-xl mb-12 text-center">Conecte-se com seu time favorito de CS do Brasil</p>

        <Card className="furia-card bg-white/5 border-gray-800 max-w-md w-full p-8">
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/Furia_Esports_logo.png" 
              alt="FURIA Panther" 
              width={80} 
              height={80} 
              className="rounded-full"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-6 text-center">Acesse sua conta</h2>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white mb-1">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                className="furia-input bg-black/50 border-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-white mb-1">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="furia-input bg-black/50 border-gray-700 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-white/80"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta? <Link href="/register" className="text-white underline">Cadastre-se</Link>
            </p>
          </div>
        </Card>
        
        <p className="mt-12 text-center text-gray-400">
          Junte-se à comunidade FURIA e tenha acesso a conteúdos exclusivos
        </p>
      </div>
    </main>
  )
}
