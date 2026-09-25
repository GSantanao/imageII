interface TemplateProps {
  children: React.ReactNode;
} 

export const Template: React.FC<TemplateProps> = ({ children }: TemplateProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50"> 
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />  
    </div>
  );    
} 

const Header: React.FC = () => {
  return (
    <header className="bg-red-900 text-white py-3">    
      <div className="container mx-auto px-4 flex justify-between items-center px-4">
        <h1>ImageLite</h1>
      </div>
    </header>
  );
} 

const Footer: React.FC = () => {
  return (
    <footer className="bg-red-900 text-white py-3"> 
      <div className="container mx-auto px-4 flex justify-between items-center px-4">
        <h1>Developed by Gabriel Santana</h1>
      </div>   
    </footer>
  );
}