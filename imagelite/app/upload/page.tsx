'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { Button, Template } from '@/components';
import { useImageService } from '@/resource/service';

export default function UploadPage() {
  const imageService = useImageService();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function processFile(selectedFile: File | null) {
    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos (PNG, JPG, JPEG, GIF).');
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('O arquivo deve ter no máximo 20 MB.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    processFile(selectedFile);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    processFile(droppedFile);
  }

  const tagsList = tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    const imageName = name.trim();
    if (!imageName) return setError('Informe o nome da imagem.');
    if (!file) return setError('Selecione um arquivo de imagem.');
    if (file.size > 20 * 1024 * 1024) return setError('O arquivo deve ter no máximo 20 MB.');
    if (tagsList.length === 0) return setError('Informe pelo menos uma tag.');

    setIsLoading(true);
    try {
      await imageService.enviar(file, imageName, tagsList);
      setSuccess(true);
      setName('');
      setFile(null);
      setPreviewUrl(null);
      setTagsText('');
      formRef.current?.reset();
    } catch (cause) {
      console.error('Erro ao enviar imagem:', cause);
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível enviar a imagem.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Template>
      <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
        <main className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-gray-900">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 text-center">
            Enviar imagem
          </h1>

          <form ref={formRef} className="flex flex-col gap-5 text-gray-900" onSubmit={handleSubmit}>
            
            {/* Campo Nome */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Nome da imagem *</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Foto do Rodapé"
              />
            </div>

            {/* Zona de Drag & Drop + Preview */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-gray-900">
                Arquivo (PNG, JPG, JPEG ou GIF; máximo de 20 MB) *
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                    : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="flex flex-col items-center space-y-3">
                    <img
                      src={previewUrl}
                      alt="Pré-visualização"
                      className="max-h-48 w-auto object-contain rounded-lg border border-gray-200 shadow-sm"
                    />
                    <div className="text-center text-xs text-gray-600">
                      <p className="font-semibold text-gray-800 truncate max-w-[250px]">{file?.name}</p>
                      <p>{file && (file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <span className="text-blue-600 font-medium hover:underline mt-1 inline-block">
                        Clique ou arraste para substituir
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-2 py-3">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      Arraste e solte uma imagem aqui, ou{' '}
                      <span className="text-blue-600 font-semibold underline">clique para selecionar</span>
                    </p>
                    <p className="text-xs text-gray-400">Suporta PNG, JPG, JPEG e GIF até 20 MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Campo Tags */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-900">Tags separadas por vírgula *</label>
              <input
                type="text"
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                placeholder="natureza, viagem"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagsList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar imagem'}
            </Button>
          </form>

          {/* Feedback */}
          {error && (
            <div
              className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center"
              role="alert"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-100 text-center"
              role="status"
            >
              Imagem enviada com sucesso!
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              className="text-sm font-medium text-gray-600 hover:text-gray-900 underline transition-colors"
              href="/galeria"
            >
              Voltar para a galeria
            </Link>
          </div>
        </main>
      </div>
    </Template>
  );
}