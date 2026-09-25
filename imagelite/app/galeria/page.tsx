'use client'

import { Template, ImageCard } from '@/components';
import { useImageService } from '@/resource/service';
import { Image } from '@/resource/service';
import { useState } from 'react';

export default function Galeria() {

  const useService = useImageService()
  const [images, setImages] = useState<Image[]>([])
  const [query, setQuery] = useState<string>('')
  const [extension, setExtension] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function searchImages() {
    setLoading(true)
    try {
      const result = await useService.buscar(query, extension);
      setImages(result);
      console.log(query, extension)
    } catch (error) {
      console.error("Erro ao buscar imagens:", error)
    } finally {
      setLoading(false)
    }
  }

  function renderImageCard(image: Image, index: number) {
    return (
      <ImageCard
        key={image.id || image.url || index}
        imageName={image.name}
        imageUrl={image.url}
        imageSize={image.size}
        uploadDate={image.uploadDate}
        extension={image.extension}
      />
    )
  }

  function renderImageCards() {
    return images.map((image, index) => renderImageCard(image, index));
  }

  return (
    <Template>
      <section className="flex flex-col items-center justify-center my-5">
        <div className="flex space-x-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Buscar imagens..." 
          />
          <select 
            value={extension}
            onChange={event => setExtension(event.target.value)} 
            className="border px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All formats</option>
            <option value="PNG">PNG</option>
            <option value="JPG">JPG</option>
            <option value="GIF">GIF</option>
            <option value="JPEG">JPEG</option>
          </select>

          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center min-w-[90px] disabled:opacity-50" 
            onClick={searchImages}
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              'Search'
            )}
          </button>

          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Add New 
          </button>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center my-12 text-gray-600 space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="font-semibold text-lg">Carregando imagens...</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {renderImageCards()}
        </section>
      )}
    </Template>
  )
}