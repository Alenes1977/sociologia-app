import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { temasData } from '../dataTemas';
import Confetti from 'react-confetti';
import { HelpCircle, Lightbulb } from 'lucide-react';

const MAXIMO_INTENTOS = 6;
const VICTORIAS_PARA_CONFETI = 3;
const COSTO_PISTA = 4;

const Ahorcado = ({ temaId, onVolver }) => {
  const [palabraActual, setPalabraActual] = useState({ termino: '', definicion: '' });
  const [letrasAdivinadas, setLetrasAdivinadas] = useState([]);
  const [intentosRestantes, setIntentosRestantes] = useState(MAXIMO_INTENTOS);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [victoria, setVictoria] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [palabrasJugadas, setPalabrasJugadas] = useState(0);
  const [victoriasConsecutivas, setVictoriasConsecutivas] = useState(0);
  const [pistaMostrada, setPistaMostrada] = useState(false);

  useEffect(() => {
    if (!mostrarInstrucciones) {
      seleccionarNuevaPalabra();
    }
  }, [mostrarInstrucciones, temaId]);

  const seleccionarNuevaPalabra = () => {
    const conceptos = temasData[temaId]?.conceptosClave || [];
    if (conceptos.length > 0) {
      const palabraSeleccionada = conceptos[Math.floor(Math.random() * conceptos.length)];
      setPalabraActual(palabraSeleccionada);
      setLetrasAdivinadas([]);
      setJuegoTerminado(false);
      setVictoria(false);
      setPistaMostrada(false);
    } else {
      console.error('No hay conceptos disponibles para este tema');
      onVolver();
    }
  };

  const normalizarLetra = (letra) => {
    return letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const manejarLetraSeleccionada = (letra) => {
    if (juegoTerminado || !palabraActual.termino) return;

    const letraNormalizada = normalizarLetra(letra.toLowerCase());
    if (!letrasAdivinadas.includes(letraNormalizada)) {
      setLetrasAdivinadas([...letrasAdivinadas, letraNormalizada]);

      if (!normalizarLetra(palabraActual.termino.toLowerCase()).includes(letraNormalizada)) {
        setIntentosRestantes(intentosRestantes - 1);
      }

      verificarEstadoJuego(letraNormalizada);
    }
  };

  const verificarEstadoJuego = (nuevaLetra) => {
    if (!palabraActual.termino) return;

    const todasLetrasAdivinadas = normalizarLetra(palabraActual.termino.toLowerCase())
      .split('')
      .every(letra => letra === ' ' || letra === ',' || [...letrasAdivinadas, nuevaLetra].includes(letra));

    if (todasLetrasAdivinadas) {
      setJuegoTerminado(true);
      setVictoria(true);
      const nuevasVictoriasConsecutivas = victoriasConsecutivas + 1;
      setVictoriasConsecutivas(nuevasVictoriasConsecutivas);
      setPalabrasJugadas(palabrasJugadas + 1);
      if (nuevasVictoriasConsecutivas >= VICTORIAS_PARA_CONFETI) {
        setMostrarConfeti(true);
      }
    } else if (intentosRestantes <= 1) {
      setJuegoTerminado(true);
      setVictoria(false);
      setVictoriasConsecutivas(0);
      setPalabrasJugadas(palabrasJugadas + 1);
    }
  };

  const continuarJugando = () => {
    seleccionarNuevaPalabra();
    setMostrarConfeti(false);
  };

  const mostrarPista = () => {
    if (!pistaMostrada && intentosRestantes > COSTO_PISTA) {
      setPistaMostrada(true);
      setIntentosRestantes(intentosRestantes - COSTO_PISTA);
    }
  };

  const renderPalabra = () => {
    if (!palabraActual.termino) return null;

    return palabraActual.termino.split('').map((letra, index) => (
      <span key={index} className="text-4xl font-bold mx-1">
        {letra === ' ' || letra === ',' ? letra : (letrasAdivinadas.includes(normalizarLetra(letra.toLowerCase())) ? letra : '_')}
      </span>
    ));
  };

  const renderTeclado = () => {
    const letras = 'abcdefghijklmnñopqrstuvwxyz'.split('');
    return (
      <div className="grid grid-cols-9 gap-2 mt-4">
        {letras.map((letra) => (
          <Button
            key={letra}
            onClick={() => manejarLetraSeleccionada(letra)}
            disabled={letrasAdivinadas.includes(normalizarLetra(letra)) || juegoTerminado}
            className="w-10 h-10 text-lg font-semibold"
          >
            {letra}
          </Button>
        ))}
      </div>
    );
  };

  const renderInstrucciones = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones del Ahorcado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
          <li>Se seleccionará una palabra o término relacionado con el tema.</li>
          <li>Debes adivinar la palabra letra por letra.</li>
          <li>Tienes {MAXIMO_INTENTOS} intentos antes de que el juego termine.</li>
          <li>Puedes solicitar una pista, pero esto te costará {COSTO_PISTA} intentos.</li>
          <li>Si adivinas la palabra, ganas. Si agotas los intentos, pierdes.</li>
          <li>¡Consigue {VICTORIAS_PARA_CONFETI} victorias consecutivas para una sorpresa especial con confeti!</li>
        </ol>
        <Button 
          onClick={() => setMostrarInstrucciones(false)} 
          className="mt-6 bg-sociologia-600 hover:bg-sociologia-700 text-white"
        >
          Comenzar
        </Button>
      </CardContent>
    </Card>
  );

  if (mostrarInstrucciones) {
    return renderInstrucciones();
  }

  if (!palabraActual.termino) {
    return <div>Cargando palabra...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {mostrarConfeti && <Confetti recycle={false} numberOfPieces={200} />}
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-sociologia-700">
          Juego del Ahorcado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-lg mb-2">Intentos restantes: {intentosRestantes}</p>
          <p className="text-lg">Victorias consecutivas: {victoriasConsecutivas}</p>
        </div>
        <div className="text-center mb-6">
          {renderPalabra()}
        </div>
        {juegoTerminado ? (
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${victoria ? 'text-green-600' : 'text-red-600'} mb-4`}>
              {victoria ? '¡Has ganado!' : 'Has perdido'}
            </h3>
            <p className="text-xl mb-4">
              La palabra era: <span className="font-bold">{palabraActual.termino}</span>
            </p>
            <p className="text-lg mb-6">
              Definición: {palabraActual.definicion}
            </p>
            <Button 
              onClick={continuarJugando} 
              className="mr-2 bg-sociologia-600 hover:bg-sociologia-700 text-white text-lg px-6 py-3 transform hover:scale-105 transition-transform"
            >
              Seguir jugando
            </Button>
            <div className="mt-4 flex justify-end">
              <Button onClick={onVolver} className="bg-gray-400 hover:bg-gray-500 text-white">
                Volver a las actividades
              </Button>
            </div>
          </div>
        ) : (
          <>
            {renderTeclado()}
            <div className="mt-4 text-center">
              <Button 
                onClick={mostrarPista} 
                disabled={pistaMostrada || intentosRestantes <= COSTO_PISTA}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Lightbulb className="mr-2" />
                Pedir pista (-{COSTO_PISTA} intentos)
              </Button>
              {pistaMostrada && (
                <p className="mt-2 text-sociologia-600">Pista: {palabraActual.definicion}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Ahorcado;