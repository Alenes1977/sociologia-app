import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, Shuffle, ArrowLeft, ArrowRight } from 'lucide-react';
import { temasData } from '../dataTemas';

const Flashcards = ({ temaId, onVolver }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const temaData = temasData[temaId];
    const conceptosClave = temaData.conceptosClave;
    setCards(shuffleArray([...conceptosClave]));
  }, [temaId]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const shuffleCards = () => {
    setCards(shuffleArray([...cards]));
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) {
    return <div>Cargando flashcards...</div>;
  }

  const renderInstructions = () => (
    <Card className="mb-4 border-2 border-sociologia-200">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700">
        <HelpCircle className="mr-2" />
        Instrucciones para las FlashCards
        </CardTitle>
      </CardHeader>
      <CardContent>
      <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
          <li>Haz clic en la tarjeta para voltearla y ver la definición.</li>
          <li>Usa los botones de navegación para moverte entre las tarjetas.</li>
          <li>Puedes mezclar las tarjetas para un repaso aleatorio.</li>
        </ol>
        <Button 
          onClick={() => setShowInstructions(false)} 
          className="mt-4 bg-sociologia-600 hover:bg-sociologia-700 text-white"
        >
          Comenzar
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <Button onClick={onVolver} variant="default" className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
          Volver a las actividades
        </Button>
        <span className="text-sm font-semibold text-sociologia-600">
          Tarjeta {currentCardIndex + 1} de {cards.length}
        </span>
      </div>
      
      {showInstructions ? renderInstructions() : (
        <>
          <AnimatePresence>
            <motion.div
              key={currentCardIndex + (isFlipped ? '-flipped' : '')}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <Card 
                className="w-full h-64 cursor-pointer bg-white shadow-lg border-2 border-sociologia-400 hover:border-sociologia-600 transition-all duration-300"
                onClick={flipCard}
              >
                <CardContent className="h-full flex items-center justify-center p-6 bg-gradient-to-br from-sociologia-50 to-sociologia-100">
                  <div 
                    className="w-full text-center transition-transform duration-300 ease-in-out"
                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
                  >
                    <h3 className="text-2xl font-bold text-sociologia-800 mb-2">
                      {isFlipped ? cards[currentCardIndex].definicion : cards[currentCardIndex].termino}
                    </h3>
                    <p className="text-sociologia-600 mt-4">
                      {isFlipped ? "Definición" : "Término"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-4">
            <Button onClick={prevCard} variant="default" className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button onClick={shuffleCards} variant="default" className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
              <Shuffle className="mr-2 h-4 w-4" /> Mezclar
            </Button>
            <Button onClick={nextCard} variant="default" className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Flashcards;