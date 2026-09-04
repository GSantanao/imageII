'use client'

//import { Template } from '../components/Template';
//import { ImageCard } from '../components/Image';
import { Template, ImageCard } from '@/components';

import { useState } from 'react';



export default function Galeria() {
 
  const image1 = 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aW1hZ2VucyUyMGdyYXR1aXRhc3xlbnwwfHwwfHx8MA%3D%3D'
  const image2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ0-OdSc3yA7pAB_c0L23U0cL6nw1uubBvfQIbOG3VhGxG1K48WFaigIw&s=10'
  
  const [codigoImage, setCodigoImage] = useState<number>(2);
  const [urlImage, setUrlImage] = useState<string>();

  function mudarImagem() {
    if(codigoImage == 1) {
      setCodigoImage(2);
      setUrlImage(image1)
      } else {
      setCodigoImage(1);
      setUrlImage(image2);
    }
  }

  return (
   
      <Template>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={mudarImagem}>
          Mudar Imagem
        </button>
          <section className="grid grid-cols-3 gap-4  p-4">
            
            <ImageCard imageName = {'Natureza'}
            imageUrl = {urlImage}
            imageSize = '15 mb'
            uploadDate = '2023-01-01'
            />

            <ImageCard imageName = 'Natureza'
            imageUrl = {urlImage}
            imageSize = '15 mb'
            uploadDate = '2023-01-01'
            />
            <ImageCard imageName = 'Natureza'
            imageUrl = {urlImage}
            imageSize = '15 mb'
            uploadDate = '2023-01-01'
            />
            <ImageCard imageName = 'Natureza'
            imageUrl = {urlImage}
            imageSize = '15 mb'
            uploadDate = '2023-01-01'
            />
          </section>
          
       
        
      </Template>
   
  )
}