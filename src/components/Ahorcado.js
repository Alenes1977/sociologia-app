import React, { useState, useEffect, useCallback } from 'react';
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

  const seleccionarNuevaPalabra = useCallback(() => {
    const conceptos = temasData[temaId]?.conceptosClave || [];
    if (conceptos.length > 0) {
      const palabraSeleccionada = conceptos[Math.floor(Math.random() * conceptos.length)];
      setPalabraActual(palabraSeleccionada);
      setLetrasAdivinadas([]);
      setJuegoTerminado(false);
      setVictoria(false);
      setPistaMostrada(false);
      setIntentosRestantes(MAXIMO_INTENTOS);
    } else {
      console.error('No hay conceptos disponibles para este tema');
      onVolver();
    }
  }, [temaId, onVolver]);

  useEffect(() => {
    if (!mostrarInstrucciones) {
      seleccionarNuevaPalabra();
    }
  }, [mostrarInstrucciones, seleccionarNuevaPalabra]);

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

    return (
      <div className="flex flex-wrap justify-center max-w-full overflow-hidden">
        {palabraActual.termino.split('').map((letra, index) => (
          <span key={index} className="text-lg sm:text-xl md:text-2xl font-bold mx-0.5 sm:mx-1 mb-1">
            {letra === ' ' ? '\u00A0' :
             letra === ',' ? ',' :
             letrasAdivinadas.includes(normalizarLetra(letra.toLowerCase())) ? letra : '_'}
          </span>
        ))}
      </div>
    );
  };


  const renderTeclado = () => {
    const letras = 'abcdefghijklmnñopqrstuvwxyz'.split('');
    return (
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1 sm:gap-2 mt-4">
        {letras.map((letra) => (
          <Button
            key={letra}
            onClick={() => manejarLetraSeleccionada(letra)}
            disabled={letrasAdivinadas.includes(normalizarLetra(letra)) || juegoTerminado}
            className="w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-semibold p-0"
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
        <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones del Ahorcado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-sociologia-600">
          <li>Se seleccionará una palabra o término relacionado con el tema.</li>
          <li>Debes adivinar la palabra letra por letra.</li>
          <li>Tienes {MAXIMO_INTENTOS} intentos antes de que el juego termine.</li>
          <li>Puedes solicitar una pista, pero esto te costará {COSTO_PISTA} intentos.</li>
          <li>Si adivinas la palabra, ganas. Si agotas los intentos, pierdes.</li>
          <li>¡Consigue {VICTORIAS_PARA_CONFETI} victorias consecutivas para una sorpresa especial!</li>
        </ol>
        <Button 
          onClick={() => setMostrarInstrucciones(false)} 
          className="mt-4 sm:mt-6 w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white"
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
    return <div className="text-center text-sociologia-600">Cargando palabra...</div>;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {mostrarConfeti && <Confetti recycle={false} numberOfPieces={200} />}
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-sociologia-700">
          Juego del Ahorcado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4 sm:mb-6">
          <p className="text-base sm:text-lg mb-1 sm:mb-2">Intentos restantes: {intentosRestantes}</p>
          <p className="text-base sm:text-lg">Victorias consecutivas: {victoriasConsecutivas}</p>
        </div>
        <div className="text-center mb-4 sm:mb-6 px-2">
          {renderPalabra()}
        </div>
        {juegoTerminado ? (
          <div className="text-center">
            <h3 className={`text-xl sm:text-2xl font-bold ${victoria ? 'text-green-600' : 'text-red-600'} mb-2 sm:mb-4`}>
              {victoria ? '¡Has ganado!' : 'Has perdido'}
            </h3>
            <p className="text-lg sm:text-xl mb-2 sm:mb-4">
              La palabra era: <span className="font-bold">{palabraActual.termino}</span>
            </p>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
              Definición: {palabraActual.definicion}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={continuarJugando} 
                className="w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 transform hover:scale-105 transition-transform"
              >
                Seguir jugando
              </Button>
              <Button 
                onClick={onVolver} 
                className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white"
              >
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
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base"
              >
                <Lightbulb className="mr-2" />
                Pedir pista (-{COSTO_PISTA} intentos)
              </Button>
              {pistaMostrada && (
                <p className="mt-2 text-sm sm:text-base text-sociologia-600">Pista: {palabraActual.definicion}</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Ahorcado;