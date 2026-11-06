'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Template, Button } from '@/components';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/v1/users/autenticar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
      }

      const data = await response.json();
      const token = data.accessToken || data.token;

      if (token) {
        localStorage.setItem('accessToken', token);
        document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Lax`;
        router.push('/galeria');
      } else {
        setError('Resposta inválida do servidor (token não encontrado).');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError(
        err instanceof Error ? err.message : 'Falha ao realizar login. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Template>
      <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
        <main className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-gray-900">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 text-center">
            Acessar a conta
          </h1>
          <p className="mb-6 text-sm text-gray-500 text-center">
            Entre com suas credenciais para gerenciar suas imagens
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Senha *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center" role="alert">
              {error}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Ainda não tem uma conta?{' '}
            <Link href="/" className="font-semibold text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </main>
      </div>
    </Template>
  );
}