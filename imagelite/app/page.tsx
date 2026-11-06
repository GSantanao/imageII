'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Template, Button } from '@/components';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const fullName = name.trim();
    const userEmail = email.trim();

    if (!fullName || !userEmail || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: fullName, 
          email: userEmail, 
          password 
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário. Verifique se o e-mail já está em uso.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(
        err instanceof Error ? err.message : 'Falha ao criar conta. Tente novamente.'
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
            Criar uma conta
          </h1>
          <p className="mb-6 text-sm text-gray-500 text-center">
            Preencha os dados abaixo para se cadastrar
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            {/* Nome Completo */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Nome completo *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* E-mail */}
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

            {/* Senha */}
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

            {/* Confirmar Senha */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Confirmar Senha *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </form>

          {/* Mensagens de Feedback */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-100 text-center" role="status">
              Conta criada com sucesso! Redirecionando para o login...
            </div>
          )}

          {/* Link para Ir ao Login */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Já possui uma conta?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Faça login
            </Link>
          </div>
        </main>
      </div>
    </Template>
  );
}