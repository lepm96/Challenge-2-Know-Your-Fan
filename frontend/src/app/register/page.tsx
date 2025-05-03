'use client'
import { useState } from 'react'
import { Button } from 'src/components/ui/button'
import { Card } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    instagram: '',
    twitter: '',
    facebook: '',
    favoritePlayer: '',
    followingSince: '',
    agreeTerms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (!formData.agreeTerms) {
      setError('Você precisa concordar com os Termos de Uso')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const response = await axios.post(`${API_URL}/users/register`, formData)

      if (response.data.success) {
        // Armazenar token e dados do usuário
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirecionar para a página de perfil
        router.push('/profile')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      setError(
        error.response?.data?.message || 
        'Erro ao criar conta. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="furia-container py-12 flex flex-col items-center justify-center">
        <Link href="/" className="mb-6">
          <Image 
            src="/images/logo.svg" 
            alt="FURIA Logo" 
            width={120} 
            height={42} 
          />
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-center">Cadastre-se</h1>

        <Card className="furia-card bg-white/5 border-gray-800 max-w-2xl w-full p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Nome Completo*</label>
                  <Input
                    name="name"
                    placeholder="Seu nome completo"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">E-mail*</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Senha*</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Confirmar Senha*</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Data de Nascimento</label>
                  <Input
                    name="birthDate"
                    type="date"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Cidade</label>
                  <Input
                    name="city"
                    placeholder="Sua cidade"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                Redes Sociais
              </h2>
              <p className="text-gray-400 mb-4">Conecte suas redes sociais para analisarmos suas interações com a FURIA</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Instagram</label>
                  <div className="flex">
                    <span className="bg-black/50 border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center">@</span>
                    <Input
                      name="instagram"
                      placeholder="seu_instagram"
                      className="furia-input bg-black/50 border-gray-700 text-white rounded-l-none"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-1">X</label>
                  <div className="flex">
                    <span className="bg-black/50 border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center">@</span>
                    <Input
                      name="twitter"
                      placeholder="seu_twitter"
                      className="furia-input bg-black/50 border-gray-700 text-white rounded-l-none"
                      value={formData.twitter}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white mb-1">Facebook</label>
                  <Input
                    name="facebook"
                    placeholder="https://facebook.com/seu.perfil"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                Mais informações
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-1">Jogador favorito</label>
                  <Input
                    name="favoritePlayer"
                    placeholder="Nome do jogador"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.favoritePlayer}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-white mb-1">Há quanto tempo você acompanha a FURIA?</label>
                  <Input
                    name="followingSince"
                    placeholder="Ex: 2 anos"
                    className="furia-input bg-black/50 border-gray-700 text-white"
                    value={formData.followingSince}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-start">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                className="mt-1 mr-2"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeTerms" className="text-gray-300">
                Concordo com os <Link href="#" className="text-white underline">Termos de Uso</Link> e autorizo a análise das minhas interações nas redes sociais com a FURIA.
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-white/80"
              disabled={loading}
            >
              {loading ? 'Criando Conta...' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta? <Link href="/login" className="text-white underline">Faça login</Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  )
}
