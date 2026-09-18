import { Image } from "./image";

// Reexporta a interface Image para ser usada em outras partes do app
export type { Image };

export class ImageService {
  baseURL: string = 'http://localhost:8080/images';

  async buscar(query?: string, extension?: string): Promise<Image[]> {
    const url = `${this.baseURL}?query=${query}&extension=${extension}`;
    const response = await fetch(url);
    return await response.json();
  }
}

// Custom Hook para instanciar o serviço
export const useImageService = () => new ImageService();