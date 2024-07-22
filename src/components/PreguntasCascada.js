import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
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
      <Card className="mb-4 w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones de la actividad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">

          <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
            <li>Se te presentarán 10 preguntas de dificultad creciente.</li>
            <li>Tienes 15 segundos para responder cada pregunta.</li>
            <li>Si respondes correctamente, pasarás a la siguiente pregunta.</li>
            <li>Si respondes incorrectamente o se agota el tiempo, el juego terminará.</li>
            <li>Tu objetivo es responder correctamente el mayor número de preguntas posible.</li>
            <li>¡Si respondes correctamente todas las preguntas, habrá una sorpresa especial!</li>
          </ol>
        </div>
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={iniciarJuego} 
            className="bg-sociologia-600 hover:bg-sociologia-700 text-white px-6 py-2 text-lg"
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
            <CardTitle className="text-2xl font-bold text-sociologia-700">
              {puntuacion === preguntas.length ? "¡Felicidades! ¡Has ganado!" : "Juego terminado"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">Tu puntuación final es: {puntuacion} de {preguntas.length}</p>
            <div className="space-y-4">
              {respuestasUsuario.map((respuesta, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-semibold">{index + 1}. {respuesta.pregunta.pregunta}</p>
                  <p className={respuesta.esCorrecta ? "text-green-600" : "text-red-600"}>
                    Tu respuesta: {respuesta.respuestaUsuario === "Se agotó el tiempo" ? "[Se agotó el tiempo]" : respuesta.respuestaUsuario}
                  </p>
                  {!respuesta.esCorrecta && (
                    <p className="text-green-600">Respuesta correcta: {respuesta.pregunta.respuestaCorrecta}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 space-x-2">
              <Button onClick={reiniciarJuego} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">Jugar de nuevo</Button>
              <Button onClick={onVolver} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">Volver a las actividades</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (preguntas.length === 0) {
    return <div>Cargando preguntas...</div>;
  }

  const preguntaActual = preguntas[nivelActual];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-sociologia-700">Nivel {nivelActual + 1}</CardTitle>
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
        <p className="text-lg mb-4">{preguntaActual.pregunta}</p>
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
                  className="w-full text-left justify-start py-3 px-4 transition-all duration-200 bg-sociologia-500 hover:bg-sociologia-600 text-white transform hover:scale-105"
                >
                  {opcion}
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