import { Image } from "./image";

// Reexporta a interface Image para ser usada em outras partes do app
export type { Image };

export class ImageService {
  baseURL: string = 'http://localhost:8080/images';

  async buscar(): Promise<Image[]> {
    const response = await fetch(this.baseURL);
    return await response.json();
  }
}

// Custom Hook para instanciar o serviço
export const useImageService = () => new ImageService();