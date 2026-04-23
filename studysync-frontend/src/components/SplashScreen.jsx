import { useState, useEffect } from 'react'

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Temporizador para la animación de salida (fade-out)
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Comienza a desvanecerse a los 2.5s

    return () => clearTimeout(fadeTimer);
  }, []);

  if (!isVisible) return null; // El componente padre (App.jsx) manejará el renderizado final

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] animate-out fade-out duration-500 fill-mode-forwards">
      
      {/* Luces de fondo (Blurry blurs) - Recreando tu diseño de Figma */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/40 rounded-full blur-[120px] z-[-1]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-950/40 rounded-full blur-[120px] z-[-1]"></div>

      {/* Contenedor principal del logo */}
      <div className="text-center relative">
        
        {/* Nuevo Icono de Logo (Rediseñado) */}
        <div className="flex justify-center mb-8">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 16C16 11.5817 19.5817 8 24 8H64V64H24C19.5817 64 16 60.4183 16 56V16Z" fill="#171717" stroke="#373151" strokeWidth="2"/>
                <path d="M24 16H64V24H24C19.5817 24 16 20.4183 16 16V16C16 11.5817 19.5817 8 24 8H24Z" fill="#6366F1"/>
                
                {/* Líneas Sync (Abstractas) */}
                <path d="M40 32C40 28.6863 42.6863 26 46 26H54M40 32V40M40 32C40 35.3137 37.3137 38 34 38H26M40 32V24M26 38V46M54 26V18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="26" cy="46" r="3" fill="white"/>
                <circle cx="54" cy="18" r="3" fill="white"/>
            </svg>
        </div>

        {/* Nombre de la aplicación con degradado */}
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          StudySync
        </h1>

        {/* Eslogan */}
        <p className="text-sm text-gray-500 tracking-wider font-medium uppercase mb-10">
          Organiza. Aprende. Domina.
        </p>

        {/* Indicador de carga sutil ( Spinner ) */}
        <div className="w-8 h-8 mx-auto border-2 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
        
        {/* Texto de carga */}
        <p className="text-xs text-gray-700 mt-5 tracking-wide font-medium">
          Cargando experiencia...
        </p>
      </div>
    </div>
  )
}