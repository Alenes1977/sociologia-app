import React, { useState, useEffect } from 'react';
import { temasData } from '../dataTemas';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, Settings } from 'lucide-react';
import Confetti from 'react-confetti';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const JuegoAsociacion = ({ temaId, onVolver }) => {
  const [conceptos1, setConceptos1] = useState([]);
  const [conceptos2, setConceptos2] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [completados, setCompletados] = useState([]);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [intentosExitosos, setIntentosExitosos] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mostrarModalIncorrecto, setMostrarModalIncorrecto] = useState(false);
  const [numeroParejas, setNumeroParejas] = useState(5);
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
    return () => window.removeEventListener('resize', manejarRedimensionVentana);
  }, []);

  useEffect(() => {
    const temaData = temasData[temaId];
    if (temaData && temaData.relacionesConceptos) {
      const conceptosBarajados = [...temaData.relacionesConceptos].sort(() => Math.random() - 0.5).slice(0, numeroParejas);
      setConceptos1(conceptosBarajados.map(c => ({ ...c, id: Math.random() })));
      setConceptos2(conceptosBarajados.map(c => ({ ...c, id: Math.random() })).sort(() => Math.random() - 0.5));
    }
  }, [temaId, numeroParejas]);

  const handleSeleccion = (concepto, tipo) => {
    if (seleccionado === null) {
      setSeleccionado({ ...concepto, tipo });
    } else if (seleccionado.tipo !== tipo) {
      if (
        (seleccionado.concepto1 === concepto.concepto1 && seleccionado.concepto2 === concepto.concepto2) ||
        (seleccionado.concepto1 === concepto.concepto2 && seleccionado.concepto2 === concepto.concepto1)
      ) {
        setCompletados([...completados, seleccionado, concepto]);
        setIntentosExitosos(intentosExitosos + 1);
        if (completados.length + 2 === conceptos1.length * 2) {
          setJuegoTerminado(true);
          if (intentosFallidos === 0) {
            setMostrarConfeti(true);
          }
        }
      } else {
        setIntentosFallidos(intentosFallidos + 1);
        setMostrarModalIncorrecto(true);
      }
      setSeleccionado(null);
    }
  };

  const resetJuego = () => {
    setSeleccionado(null);
    setCompletados([]);
    setIntentosFallidos(0);
    setIntentosExitosos(0);
    setJuegoTerminado(false);
    setMostrarConfeti(false);
    setMostrarInstrucciones(true);
    const temaData = temasData[temaId];
    if (temaData && temaData.relacionesConceptos) {
      const conceptosBarajados = [...temaData.relacionesConceptos].sort(() => Math.random() - 0.5).slice(0, numeroParejas);
      setConceptos1(conceptosBarajados.map(c => ({ ...c, id: Math.random() })));
      setConceptos2(conceptosBarajados.map(c => ({ ...c, id: Math.random() })).sort(() => Math.random() - 0.5));
    }
  };

  const renderConcepto = (concepto, tipo) => {
    const estaCompletado = completados.some(c => 
      (c.concepto1 === concepto.concepto1 && c.concepto2 === concepto.concepto2) ||
      (c.concepto1 === concepto.concepto2 && c.concepto2 === concepto.concepto1)
    );
    const estaSeleccionado = seleccionado && seleccionado.id === concepto.id;

    return (
      <motion.div
        key={concepto.id}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full mb-2"
      >
        <Button
          variant="default"
          className={`w-full min-h-[3rem] py-2 px-3 transition-all duration-200 text-left justify-start items-start
            ${estaCompletado ? 'bg-green-500 hover:bg-green-600' : 
              estaSeleccionado ? 'bg-yellow-500 hover:bg-yellow-600 ring-2 ring-yellow-300' : 
              'bg-sociologia-500 hover:bg-sociologia-600'}
            text-white transform hover:scale-105 text-xs sm:text-sm md:text-base`}
          onClick={() => !estaCompletado && handleSeleccion(concepto, tipo)}
          disabled={estaCompletado}
        >
          <span className="inline-block whitespace-normal break-words">{concepto[tipo]}</span>
        </Button>
      </motion.div>
    );
  };

  const renderInstrucciones = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones del Juego
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 sm:mb-6">
          <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-sociologia-600">
            <li>Haz clic en un concepto de la columna izquierda.</li>
            <li>Luego, haz clic en el concepto correspondiente de la columna derecha.</li>
            <li>Si los conceptos coinciden, se marcarán como completados.</li>
            <li>Si no coinciden, se contará como un intento fallido.</li>
            <li>Continúa hasta asociar todos los conceptos correctamente.</li>
          </ol>
        </div>
        
        <Card className="bg-sociologia-200 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl font-semibold text-sociologia-700">
              <Settings className="mr-2" />
              Configura tu actividad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 sm:mb-4 text-sm sm:text-base text-sociologia-600">Selecciona el número de parejas a asociar:</p>
            <Slider
              value={[numeroParejas]}
              onValueChange={(value) => setNumeroParejas(value[0])}
              min={5}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="mt-2 text-center text-xl sm:text-2xl font-bold text-sociologia-700">{numeroParejas} parejas</p>
          </CardContent>
        </Card>
        
        <div className="mt-4 sm:mt-6 flex justify-end">
          <Button 
            onClick={() => setMostrarInstrucciones(false)} 
            className="bg-sociologia-600 hover:bg-sociologia-700 text-white px-4 sm:px-6 py-2 text-sm sm:text-lg w-full sm:w-auto"
          >
            Comenzar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderModalIncorrecto = () => (
    <Dialog open={mostrarModalIncorrecto} onOpenChange={setMostrarModalIncorrecto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Respuesta Incorrecta</DialogTitle>
          <DialogDescription>
            Los conceptos seleccionados no están relacionados. Inténtalo de nuevo.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => setMostrarModalIncorrecto(false)}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );

  if (juegoTerminado) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 relative">
        {mostrarConfeti && (
          <Confetti
            width={dimensionesVentana.width}
            height={dimensionesVentana.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-sociologia-700">
              {intentosFallidos === 0 ? "¡Felicidades! Has completado el juego perfectamente" : "¡Bien hecho! Has completado el juego"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 sm:mb-6">
              <p className="text-base sm:text-lg mb-1 sm:mb-2">Intentos exitosos: <span className="text-green-600 font-bold">{intentosExitosos}</span></p>
              <p className="text-base sm:text-lg mb-2 sm:mb-4">Intentos fallidos: <span className="text-red-600 font-bold">{intentosFallidos}</span></p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Asociaciones correctas:</h3>
              {conceptos1.map((concepto, index) => (
                <Card key={index} className="p-3 sm:p-4 bg-sociologia-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="font-semibold text-sociologia-700 text-sm sm:text-base">{concepto.concepto1}</span>
                    <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-sociologia-500" />
                    <span className="font-semibold text-sociologia-700 text-sm sm:text-base">{concepto.concepto2}</span>
                  </div>
                  <p className="mt-2 text-sociologia-600 italic text-xs sm:text-sm">Relación: {concepto.relacion}</p>
                </Card>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
              <Button onClick={resetJuego} className="bg-sociologia-600 hover:bg-sociologia-700 text-white w-full sm:w-auto">
                Jugar de nuevo
              </Button>
              <Button onClick={onVolver} className="bg-sociologia-600 hover:bg-sociologia-700 text-white w-full sm:w-auto">
                Volver a las actividades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardContent>
          {mostrarInstrucciones ? (
            renderInstrucciones()
          ) : (
            <>
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <span className="text-xs sm:text-sm font-semibold">
                  Progreso: {completados.length / 2} / {conceptos1.length} parejas
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-green-600 mr-2 sm:mr-4">
                    Aciertos: {intentosExitosos}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-red-600">
                    Fallos: {intentosFallidos}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Concepto 1</h3>
                  <AnimatePresence>
                    {conceptos1.map(concepto => renderConcepto(concepto, 'concepto1'))}
                  </AnimatePresence>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Concepto 2</h3>
                  <AnimatePresence>
                    {conceptos2.map(concepto => renderConcepto(concepto, 'concepto2'))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex justify-center">
                <Button onClick={onVolver} className="bg-sociologia-600 hover:bg-sociologia-700 text-white w-full sm:w-auto">
                  Volver a las actividades
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {renderModalIncorrecto()}
    </div>
  );
};

export default JuegoAsociacion;