import React, { useState, useEffect } from 'react';

const FlashcardStudy = ({ card, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Cada vez que cambie la tarjeta (por su ID), volvemos a mostrar el anverso
  useEffect(() => {
    setIsFlipped(false);
  }, [card.id_flashcard, card.id]);

  const handleResult = (acierto) => {
    // Capturamos el ID correcto (el backend lo devuelve como id_flashcard en el JSON de Hibernate)
    const cardId = card.id_flashcard || card.id;
    onResult(cardId, acierto);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Contenedor de perspectiva */}
      <div 
        className="w-full h-72 cursor-pointer" 
        style={{ perspective: '1000px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-500 ease-in-out`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* CARA FRONTAL (Pregunta) */}
          <div 
            className="absolute inset-0 bg-[#111] border-2 border-indigo-500/30 rounded-[40px] flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Pregunta</span>
            <h3 className="text-2xl font-bold text-white italic leading-tight">¿{card.anverso}?</h3>
            <p className="absolute bottom-6 text-gray-600 text-[10px] uppercase font-bold tracking-widest italic">Haz clic para ver respuesta</p>
          </div>

          {/* CARA TRASERA (Respuesta) */}
          <div 
            className="absolute inset-0 bg-indigo-950 border-2 border-indigo-400/50 rounded-[40px] flex flex-col items-center justify-center p-8 text-center"
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)' 
            }}
          >
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Respuesta</span>
            <p className="text-xl text-white font-medium italic">{card.reverso}</p>
          </div>
        </div>
      </div>

      {/* Botones de acción (sólo visibles si está girada) */}
      <div className={`flex gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleResult(false); }}
          className="bg-red-500/10 hover:bg-red-500 border border-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
        >
          No la sabía
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleResult(true); }}
          className="bg-green-500/10 hover:bg-green-500 border border-green-500 text-green-500 hover:text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
        >
          ¡La acerté!
        </button>
      </div>
    </div>
  );
};

export default FlashcardStudy;