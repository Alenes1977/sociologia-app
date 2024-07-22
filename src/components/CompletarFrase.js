import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { temasData } from '../dataTemas';
import Confetti from 'react-confetti';
import { HelpCircle, Clock, Lightbulb, Send } from 'lucide-react';

const TIEMPO_POR_PREGUNTA = 15; // segundos
const TIEMPO_REDUCCION_PISTA = 5; // segundos
const MIN_FRASES = 3;
const MAX_FRASES = 15;

const CompletarFrase = ({ temaId, onVolver }) => {
  const [frases, setFrases] = useState([]);
  const [fraseActual, setFraseActual] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PREGUNTA);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [numFrases, setNumFrases] = useState(MIN_FRASES);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [respuestaUsuario, setRespuestaUsuario] = useState('');

  useEffect(() => {
    if (!mostrarInstrucciones) {
      iniciarJuego();
    }
  }, [mostrarInstrucciones, temaId]);

  useEffect(() => {
    let temporizador;
    if (!mostrarInstrucciones && !juegoTerminado && tiempoRestante > 0) {
      temporizador = setInterval(() => {
        setTiempoRestante((prevTiempo) => {
          if (prevTiempo === 1) {
            clearInterval(temporizador);
            manejarRespuesta(null);
            return 0;
          }
          return prevTiempo - 1;
        });
      }, 1000);
    }
    return () => clearInterval(temporizador);
  }, [mostrarInstrucciones, juegoTerminado, tiempoRestante]);

  const iniciarJuego = () => {
    const frasesDisponibles = temasData[temaId]?.completarFrase || [];
    const frasesSeleccionadas = frasesDisponibles.sort(() => 0.5 - Math.random()).slice(0, numFrases);
    setFrases(frasesSeleccionadas);
    setFraseActual(0);
    setRespuestas([]);
    setTiempoRestante(TIEMPO_POR_PREGUNTA);
    setJuegoTerminado(false);
    setMostrarOpciones(false);
    setRespuestaUsuario('');
  };

  const manejarRespuesta = (respuesta) => {
    const respuestaFinal = respuesta || respuestaUsuario;
    const nuevasRespuestas = [...respuestas, { 
      frase: frases[fraseActual].frase, 
      respuesta: respuestaFinal, 
      correcta: respuestaFinal.toLowerCase() === frases[fraseActual].palabraCorrecta.toLowerCase()
    }];
    setRespuestas(nuevasRespuestas);

    if (fraseActual + 1 < frases.length) {
      setFraseActual(fraseActual + 1);
      setTiempoRestante(TIEMPO_POR_PREGUNTA);
      setMostrarOpciones(false);
      setRespuestaUsuario('');
    } else {
      finalizarJuego(nuevasRespuestas);
    }
  };

  const finalizarJuego = (respuestasFinal) => {
    setJuegoTerminado(true);
    const aciertos = respuestasFinal.filter(r => r.correcta).length;
    if (aciertos === frases.length) {
      setMostrarConfeti(true);
    }
  };

  const mostrarPista = () => {
    if (!mostrarOpciones && tiempoRestante > TIEMPO_REDUCCION_PISTA) {
      setMostrarOpciones(true);
      setTiempoRestante(tiempoRestante - TIEMPO_REDUCCION_PISTA);
    }
  };

  const renderFrase = () => {
    if (frases.length === 0) return null;
    const fraseActualObj = frases[fraseActual];
    const partesFrase = fraseActualObj.frase.split('[BLANK]');
    
    return (
      <div className="text-center mb-6">
        <p className="text-xl mb-4">
          {partesFrase[0]}
          <span className="font-bold text-sociologia-600">_______</span>
          {partesFrase[1]}
        </p>
        <div className="flex items-center justify-center mb-4">
          <Input
            type="text"
            value={respuestaUsuario}
            onChange={(e) => setRespuestaUsuario(e.target.value)}
            placeholder="Escribe tu respuesta aquí"
            className="mr-2 w-64"
          />
          <Button
            onClick={() => manejarRespuesta(respuestaUsuario)}
            className="bg-sociologia-500 hover:bg-sociologia-600 text-white"
          >
            <Send className="mr-2" />
            Enviar
          </Button>
        </div>
        {!mostrarOpciones && (
          <Button
            onClick={mostrarPista}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white"
            disabled={tiempoRestante <= TIEMPO_REDUCCION_PISTA}
          >
            <Lightbulb className="mr-2" />
            Mostrar opciones (-{TIEMPO_REDUCCION_PISTA}s)
          </Button>
        )}
        {mostrarOpciones && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {fraseActualObj.opciones.map((opcion, index) => (
              <Button
                key={index}
                onClick={() => manejarRespuesta(opcion)}
                className="bg-sociologia-500 hover:bg-sociologia-600 text-white"
              >
                {opcion}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInstrucciones = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones para "Completar la frase"
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
          <li>Se te presentará una serie de frases con una palabra faltante.</li>
          <li>Puedes escribir tu respuesta directamente en el campo de texto.</li>
          <li>También puedes pedir una pista para ver las opciones, pero esto reducirá tu tiempo en {TIEMPO_REDUCCION_PISTA} segundos.</li>
          <li>Tienes {TIEMPO_POR_PREGUNTA} segundos para responder cada frase.</li>
          <li>Si no respondes a tiempo, se contará como "sin contestar".</li>
          <li>Al final, verás un resumen de tus respuestas.</li>
          <li>¡Si aciertas todas, recibirás una sorpresa especial!</li>
        </ol>
        <Card className="mt-6 bg-sociologia-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-sociologia-700">
              Configura tu actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sociologia-600">Selecciona el número de frases:</p>
            <Slider
              value={[numFrases]}
              onValueChange={(value) => setNumFrases(value[0])}
              min={MIN_FRASES}
              max={MAX_FRASES}
              step={1}
              className="w-full"
            />
            <p className="mt-2 text-center text-2xl font-bold text-sociologia-700">{numFrases} frases</p>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={() => setMostrarInstrucciones(false)} 
            className="bg-sociologia-600 hover:bg-sociologia-700 text-white px-6 py-2 text-lg"
          >
            Comenzar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (mostrarInstrucciones) {
    return renderInstrucciones();
  }

  if (juegoTerminado) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        {mostrarConfeti && <Confetti recycle={false} numberOfPieces={200} />}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-sociologia-700">
            Resumen del Juego
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-4">
            Has acertado {respuestas.filter(r => r.correcta).length} de {frases.length} frases.
          </p>
          <div className="space-y-4">
            {respuestas.map((respuesta, index) => (
              <div key={index} className={`p-4 rounded ${respuesta.correcta ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="mb-2">
                  {respuesta.frase.replace('[BLANK]', `[${respuesta.respuesta === null ? 'sin contestar' : respuesta.respuesta}]`)}
                </p>
                <p className={`font-semibold ${respuesta.correcta ? 'text-green-600' : 'text-red-600'}`}>
                  {respuesta.correcta ? 'Correcto' : `Incorrecto. La respuesta correcta era: ${frases[index].palabraCorrecta}`}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button onClick={iniciarJuego} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Jugar de nuevo
            </Button>
            <Button onClick={onVolver} className="bg-gray-400 hover:bg-gray-500 text-white">
              Volver a las actividades
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-sociologia-700 flex justify-between items-center">
          <span>Completar Frase</span>
          <span className="text-xl flex items-center">
            <Clock className="mr-2" />
            {tiempoRestante}s
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-lg">Frase {fraseActual + 1} de {frases.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-sociologia-600 h-2.5 rounded-full"
              style={{ width: `${((fraseActual + 1) / frases.length) * 100}%` }}
            ></div>
          </div>
        </div>
        {renderFrase()}
      </CardContent>
    </Card>
  );
};

export default CompletarFrase;