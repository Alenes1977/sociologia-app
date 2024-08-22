import React, { useState, useEffect, useCallback } from 'react';
import { temasData } from '../dataTemas';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { CheckCircle, XCircle, HelpCircle, Settings, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizInteractivo = ({ temaId, onVolver }) => {
  const [numPreguntas, setNumPreguntas] = useState(5);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [dimensionesVentana, setDimensionesVentana] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const temaData = temasData[temaId];
  const allQuestions = temaData.preguntasQuiz;

  useEffect(() => {
    const manejarRedimensionVentana = () => {
      setDimensionesVentana({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', manejarRedimensionVentana);
    return () => window.removeEventListener('resize', manejarRedimensionVentana);
  }, []);

  const initializeQuiz = useCallback(() => {
    const selectedQuestions = shuffleArray([...allQuestions]).slice(0, numPreguntas);
    const shuffledQuestionsWithShuffledOptions = selectedQuestions.map((question) => {
      const opciones = shuffleArray([...question.opciones]);
      const respuestaCorrecta = opciones.indexOf(question.opciones[question.respuestaCorrecta]);
      return {
        ...question,
        opciones,
        respuestaCorrecta
      };
    });
    setShuffledQuestions(shuffledQuestionsWithShuffledOptions);
  }, [allQuestions, numPreguntas]);

  useEffect(() => {
    if (!mostrarInstrucciones) {
      initializeQuiz();
    }
  }, [temaId, numPreguntas, mostrarInstrucciones, initializeQuiz]);

  const handleAnswerOptionClick = (selectedIndex) => {
    setUserAnswers([...userAnswers, selectedIndex]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      const score = userAnswers.filter(
        (answer, index) => answer === shuffledQuestions[index].respuestaCorrecta
      ).length + (selectedIndex === shuffledQuestions[currentQuestion].respuestaCorrecta ? 1 : 0);
      
      if (score / shuffledQuestions.length > 0.9) {
        setMostrarConfeti(true);
      }
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setUserAnswers([]);
    setMostrarConfeti(false);
    setMostrarInstrucciones(true);
  };

  const renderQuestion = (question, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <Card key={index} className="mb-4 border-2 border-sociologia-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Pregunta {index + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-base sm:text-xl">{question.pregunta}</p>
          <div className="space-y-3">
            {question.opciones.map((opcion, opIndex) => (
              <Button
                key={opIndex}
                variant="default"
                className="w-full min-h-[60px] h-auto text-left justify-start py-3 px-4 transition-all duration-200 hover:bg-sociologia-500 focus:bg-sociologia-600 text-white transform hover:scale-105 text-base sm:text-lg"
                onClick={() => handleAnswerOptionClick(opIndex)}
              >
                <span className="block whitespace-normal">{opcion}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderReviewQuestion = (question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.respuestaCorrecta;

    return (
      <Card key={index} className="mb-4 border-2 border-sociologia-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 mr-2" />
            )}
            Pregunta {index + 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{question.pregunta}</p>
          {question.opciones.map((opcion, opIndex) => (
            <div
              key={opIndex}
              className={`p-2 rounded mb-2 ${
                opIndex === userAnswer
                  ? isCorrect
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : opIndex === question.respuestaCorrecta
                  ? 'bg-green-100 border-green-500'
                  : ''
              } ${
                opIndex === userAnswer || opIndex === question.respuestaCorrecta
                  ? 'border-2'
                  : ''
              }`}
            >
              {opcion}
              {opIndex === question.respuestaCorrecta && !isCorrect && (
                <span className="ml-2 text-green-600 font-semibold">
                  (Respuesta correcta)
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderInstrucciones = () => (
    <Card className="mb-4 relative">
      <div className="absolute top-4 right-4">
        <Button 
          onClick={onVolver}
          variant="outline" 
          className="border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700 mt-12">
          <HelpCircle className="mr-2" />
          Instrucciones del Quiz
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
            <li>Se te presentará una serie de preguntas de opción múltiple.</li>
            <li>Lee cada pregunta cuidadosamente y selecciona la respuesta que consideres correcta.</li>
            <li>Una vez seleccionada una respuesta, pasarás automáticamente a la siguiente pregunta.</li>
            <li>No podrás volver a las preguntas anteriores, así que elige con cuidado.</li>
            <li>Al final del quiz, verás tu puntuación y podrás revisar tus respuestas.</li>
          </ol>
        </div>
        
        <Card className="bg-sociologia-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-sociologia-700">
              <Settings className="mr-2" />
              Configura tu quiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sociologia-600">Selecciona el número de preguntas para tu quiz:</p>
            <Slider
              value={[numPreguntas]}
              onValueChange={(value) => setNumPreguntas(value[0])}
              min={5}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="mt-2 text-center text-2xl font-bold text-sociologia-700">{numPreguntas} preguntas</p>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => setMostrarInstrucciones(false)} 
            className="bg-sociologia-600 hover:bg-sociologia-700 text-white px-6 py-2 text-lg"
          >
            Comenzar quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (mostrarInstrucciones) {
    return renderInstrucciones();
  }

  if (showScore) {
    const score = userAnswers.filter(
      (answer, index) => answer === shuffledQuestions[index].respuestaCorrecta
    ).length;
  
    return (
      <div className="space-y-4 relative">
        {mostrarConfeti && (
          <Confetti
            width={dimensionesVentana.width}
            height={dimensionesVentana.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-sociologia-700 mb-4 text-center">
            {score / shuffledQuestions.length > 0.9 
              ? "¡Felicidades! Has obtenido un resultado excelente."
              : "Has completado el quiz."}
          </h2>
          <p className="text-xl text-sociologia-600 mb-6 text-center">
            Has acertado <span className="font-bold text-sociologia-700">{score}</span> de <span className="font-bold text-sociologia-700">{shuffledQuestions.length}</span> preguntas
          </p>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={resetQuiz} 
              className="w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white px-6 py-2"
            >
              Reiniciar Quiz
            </Button>
            <Button 
              onClick={onVolver} 
              variant="outline" 
              className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
            </Button>
          </div>
        </div>
        {shuffledQuestions.map((question, index) => renderReviewQuestion(question, index))}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button 
            onClick={resetQuiz} 
            className="w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white px-6 py-2"
          >
            Reiniciar Quiz
          </Button>
          <Button 
            onClick={onVolver} 
            variant="outline" 
            className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
          </Button>
          
        </div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">Quiz: {temasData[temaId].titulo}</CardTitle>
        <Button 
          onClick={onVolver}
          variant="outline" 
          className="border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <span className="text-xs sm:text-sm font-semibold">
            Progreso: pregunta {currentQuestion + 1} / {shuffledQuestions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
          ></div>
        </div>
        <AnimatePresence>
          {renderQuestion(shuffledQuestions[currentQuestion], currentQuestion)}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QuizInteractivo;