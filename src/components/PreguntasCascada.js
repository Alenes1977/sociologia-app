import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, HelpCircle, ArrowLeft } from 'lucide-react';
import { temasData } from '../dataTemas';
import Confetti from 'react-confetti';

const TIEMPO_POR_PREGUNTA = 15; // segundos

const PreguntasCascada = ({ temaId, onVolver }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [nivelActual, setNivelActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PREGUNTA);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [dimensionesVentana, setDimensionesVentana] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const manejarRedimensionVentana = () => {
      setDimensionesVentana({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', manejarRedimensionVentana);

    return () => {
      window.removeEventListener('resize', manejarRedimensionVentana);
    };
  }, []);

  useEffect(() => {
    const temaData = temasData[temaId];
    if (temaData && temaData.preguntasCascada) {
      const preguntasAleatorias = shuffleArray(temaData.preguntasCascada).slice(0, 10);
      setPreguntas(preguntasAleatorias.map(pregunta => ({
        ...pregunta,
        opciones: shuffleArray(pregunta.opciones)
      })));
    }
  }, [temaId]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const finalizarJuego = useCallback(() => {
    setJuegoTerminado(true);
    if (puntuacion + 1 === preguntas.length) {
      setMostrarConfeti(true);
    }
  }, [puntuacion, preguntas.length]);

  const manejarRespuesta = useCallback((respuesta) => {
    const preguntaActual = preguntas[nivelActual];
    const esCorrecta = respuesta === preguntaActual.respuestaCorrecta;
    setRespuestasUsuario(prev => [...prev, { pregunta: preguntaActual, respuestaUsuario: respuesta, esCorrecta }]);

    if (esCorrecta) {
      setPuntuacion(prev => prev + 1);
      if (nivelActual + 1 < preguntas.length) {
        setNivelActual(prev => prev + 1);
        setTiempoRestante(TIEMPO_POR_PREGUNTA);
      } else {
        finalizarJuego();
      }
    } else {
      finalizarJuego();
    }
  }, [nivelActual, preguntas, finalizarJuego]);

  useEffect(() => {
    let temporizador;
    if (juegoIniciado && !juegoTerminado && tiempoRestante > 0) {
      temporizador = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev === 1) {
            clearInterval(temporizador);
            manejarRespuesta("Se agotó el tiempo");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(temporizador);
  }, [juegoIniciado, juegoTerminado, tiempoRestante, manejarRespuesta]);

  const reiniciarJuego = () => {
    setNivelActual(0);
    setPuntuacion(0);
    setJuegoTerminado(false);
    setRespuestasUsuario([]);
    setTiempoRestante(TIEMPO_POR_PREGUNTA);
    setJuegoIniciado(false);
    setMostrarConfeti(false);
    const preguntasAleatorias = shuffleArray(temasData[temaId].preguntasCascada).slice(0, 10);
    setPreguntas(preguntasAleatorias.map(pregunta => ({
      ...pregunta,
      opciones: shuffleArray(pregunta.opciones)
    })));
  };

  const iniciarJuego = () => {
    setJuegoIniciado(true);
  };

  if (!juegoIniciado) {
    return (
      <Card className="mb-4 w-full max-w-2xl mx-auto relative">
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
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-sociologia-700 mt-12">
            <HelpCircle className="mr-2" />
            Instrucciones de la actividad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 sm:mb-6">
            <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-sociologia-600">
              <li>Se te presentarán 10 preguntas de dificultad creciente.</li>
              <li>Tienes 15 segundos para responder cada pregunta.</li>
              <li>Si respondes correctamente, pasarás a la siguiente pregunta.</li>
              <li>Si respondes incorrectamente o se agota el tiempo, el juego terminará.</li>
              <li>Tu objetivo es responder correctamente el mayor número de preguntas posible.</li>
              <li>¡Si respondes correctamente todas las preguntas, habrá una sorpresa especial!</li>
            </ol>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-end">
            <Button 
              onClick={iniciarJuego} 
              className="bg-sociologia-600 hover:bg-sociologia-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-lg w-full sm:w-auto"
            >
              Comenzar actividad
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (juegoTerminado) {
    return (
      <div className="relative w-full h-full">
        {mostrarConfeti && (
          <Confetti
            width={dimensionesVentana.width}
            height={dimensionesVentana.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-sociologia-700">
              {puntuacion === preguntas.length ? "¡Felicidades! ¡Has ganado!" : "Juego terminado"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg sm:text-xl mb-4">Tu puntuación final es: {puntuacion} de {preguntas.length}</p>
            <div className="space-y-3 sm:space-y-4">
              {respuestasUsuario.map((respuesta, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-semibold text-sm sm:text-base">{index + 1}. {respuesta.pregunta.pregunta}</p>
                  <p className={`text-sm sm:text-base ${respuesta.esCorrecta ? "text-green-600" : "text-red-600"}`}>
                    Tu respuesta: {respuesta.respuestaUsuario === "Se agotó el tiempo" ? "[Se agotó el tiempo]" : respuesta.respuestaUsuario}
                  </p>
                  {!respuesta.esCorrecta && (
                    <p className="text-sm sm:text-base text-green-600">Respuesta correcta: {respuesta.pregunta.respuestaCorrecta}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
              <Button onClick={reiniciarJuego} className="bg-sociologia-600 hover:bg-sociologia-700 text-white w-full sm:w-auto">Jugar de nuevo</Button>
              <Button 
                onClick={onVolver} 
                variant="outline" 
                className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (preguntas.length === 0) {
    return <div className="text-center text-sociologia-600">Cargando preguntas...</div>;
  }

  const preguntaActual = preguntas[nivelActual];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">Nivel {nivelActual + 1}</CardTitle>
        <Button 
          onClick={onVolver}
          variant="outline" 
          className="border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Abandonar prueba
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((nivelActual + 1) / preguntas.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center text-sociologia-600">
            <Clock className="mr-1" />
            <span>{tiempoRestante}s</span>
          </div>
        </div>
        <p className="text-base sm:text-lg mb-4 font-medium">{preguntaActual.pregunta}</p>
        <div className="grid grid-cols-1 gap-2">
          <AnimatePresence>
            {preguntaActual.opciones.map((opcion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  onClick={() => manejarRespuesta(opcion)}
                  className="w-full min-h-[3rem] text-left justify-start py-2 px-3 transition-all duration-200 bg-sociologia-500 hover:bg-sociologia-600 text-white transform hover:scale-105"
                >
                  <span className="inline-block whitespace-normal break-words text-xs sm:text-sm">{opcion}</span>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreguntasCascada;