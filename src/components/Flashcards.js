import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, ArrowLeft, ArrowRight, Lightbulb, Book, CheckCircle } from 'lucide-react';
import { temasData } from '../dataTemas';

// Definimos el componente Progress aquí mismo para evitar problemas de importación
const Progress = ({ value, max = 100, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-sociologia-200 rounded-full h-2.5 ${className}`}>
      <div 
        className="bg-sociologia-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const Flashcards = ({ temaId, onVolver }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [reviewedCards, setReviewedCards] = useState(new Set());

  useEffect(() => {
    const temaData = temasData[temaId];
    const conceptosClave = temaData.conceptosClave;
    setCards(shuffleArray([...conceptosClave]));
    setReviewedCards(new Set());
  }, [temaId]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setReviewedCards(prev => new Set(prev).add(currentCardIndex));
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  if (cards.length === 0) {
    return <div className="text-center text-sociologia-600 font-semibold">Cargando flashcards...</div>;
  }

  const renderInstructions = () => (
    <Card className="mb-4 border-2 border-sociologia-300 bg-gradient-to-br from-sociologia-50 to-sociologia-100 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <h2 className="flex items-center text-xl sm:text-2xl font-bold text-sociologia-700 mb-4">
          <HelpCircle className="mr-2" />
          Instrucciones para las FlashCards
        </h2>
        <ol className="list-decimal list-inside space-y-2 sm:space-y-3 text-sm sm:text-base text-sociologia-600">
          <li>Haz clic en la tarjeta para voltearla y ver la definición.</li>
          <li>Usa los botones de navegación para moverte entre las tarjetas.</li>
          <li>Tu progreso se guardará mientras repasas las tarjetas.</li>
        </ol>
        <Button 
          onClick={() => setShowInstructions(false)} 
          className="mt-4 sm:mt-6 w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Comenzar el Repaso
        </Button>
      </CardContent>
    </Card>
  );

  const progressPercentage = (reviewedCards.size / cards.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-sociologia-50 to-white rounded-xl shadow-2xl">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <Button 
          onClick={onVolver} 
          variant="outline" 
          className="w-full text-left justify-start sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
        </Button>
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md w-full sm:w-auto justify-center">
          <Book className="text-sociologia-500 mr-2" size={20} />
          <span className="text-sm font-semibold text-sociologia-600">
            Tarjeta {currentCardIndex + 1} de {cards.length}
          </span>
        </div>
      </div>
      
      {showInstructions ? renderInstructions() : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCardIndex + (isFlipped ? '-flipped' : '')}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
              className="mb-4 sm:mb-6 perspective"
            >
              <Card 
                className="w-full min-h-[16rem] sm:min-h-[24rem] cursor-pointer bg-gradient-to-br from-sociologia-50 to-sociologia-100 shadow-2xl border-2 border-sociologia-300 hover:border-sociologia-500 transition-all duration-300 transform hover:scale-102 rounded-2xl overflow-hidden"
                onClick={flipCard}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-4 sm:p-8">
                  <div 
                    className="w-full h-full text-center transition-transform duration-500 ease-in-out backface-hidden flex flex-col items-center justify-center"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
                  >
                    {isFlipped ? (
                      <CheckCircle className="text-sociologia-500 mb-4 sm:mb-6 flex-shrink-0" size={32} />
                    ) : (
                      <Lightbulb className="text-sociologia-500 mb-4 sm:mb-6 flex-shrink-0" size={32} />
                    )}
                    <h3 className="text-2xl sm:text-3xl font-bold text-sociologia-800 mb-4 sm:mb-6 leading-tight">
                      {isFlipped ? cards[currentCardIndex].definicion : cards[currentCardIndex].termino}
                    </h3>
                    <p className="text-sociologia-600 mt-auto bg-white bg-opacity-50 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                      {isFlipped ? "Definición" : "Término"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between mb-2 text-sm font-medium text-sociologia-600">
              <span>Progreso</span>
              <span>{Math.round(progressPercentage)}% Completado</span>
            </div>
            <Progress value={reviewedCards.size} max={cards.length} />
          </div>

          <div className="flex justify-between space-x-2">
            <Button onClick={prevCard} variant="outline" className="w-1/2 border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button onClick={nextCard} variant="outline" className="w-1/2 border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Flashcards;