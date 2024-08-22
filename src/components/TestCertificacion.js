import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { temasData } from '../dataTemas';
import Confetti from 'react-confetti';
import { HelpCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const TestCertificacion = ({ temaId, onVolver }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [testCompletado, setTestCompletado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mostrarRevision, setMostrarRevision] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [temaCompleto, setTemaCompleto] = useState('');
  const [envioCompletado, setEnvioCompletado] = useState(false);

  useEffect(() => {
    const cargarPreguntas = () => {
      const temaData = temasData[temaId];
      if (temaData && temaData.preguntasQuiz) {
        const preguntasAleatorias = temaData.preguntasQuiz
          .sort(() => 0.5 - Math.random())
          .slice(0, 30)
          .map(pregunta => {
            const opcionesAleatorias = pregunta.opciones
              .map((texto, index) => ({
                texto,
                esCorrecta: index === pregunta.respuestaCorrecta,
                indiceOriginal: index
              }))
              .sort(() => 0.5 - Math.random());

            return {
              ...pregunta,
              opciones: opcionesAleatorias
            };
          });
        setPreguntas(preguntasAleatorias);
        setTemaCompleto(`TEMA ${temaId}. ${temaData.subtitulo}`);
        setCargando(false);
      } else {
        setError('No se pudieron cargar las preguntas. Por favor, inténtalo de nuevo.');
        setCargando(false);
      }
    };

    cargarPreguntas();
  }, [temaId]);

  const handleRespuesta = (respuestaIndex) => {
    const nuevasRespuestas = {
      ...respuestas,
      [preguntaActual]: respuestaIndex
    };
    setRespuestas(nuevasRespuestas);

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(prevPregunta => prevPregunta + 1);
    } else {
      finalizarTest(nuevasRespuestas);
    }
  };

  const finalizarTest = (respuestasFinales) => {
    const aciertos = preguntas.reduce((total, pregunta, index) => {
      const respuestaUsuario = respuestasFinales[index];
      const opcionUsuario = pregunta.opciones[respuestaUsuario];
      const esCorrecta = opcionUsuario && opcionUsuario.esCorrecta;
      return total + (esCorrecta ? 1 : 0);
    }, 0);

    setPuntuacion(aciertos);
    setTestCompletado(true);
    setMostrarRevision(true);

    if ((aciertos / preguntas.length) >= 0.8) {
      setMostrarConfeti(true);
    }
  };

  const enviarResultados = async () => {
    if (!nombre || !apellidos || !email) {
      setError('Por favor, introduce tu nombre, apellidos y email.');
      return;
    }

    setEnviando(true);
    setError('');

    const fechaActual = new Date();
    
    const fechaDia = fechaActual.toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const fechaHora = fechaActual.toLocaleString('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    try {
      const response = await fetch('https://gcn8n.aprendizajeconia.com/webhook/sociologia-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          email,
          tema: temaCompleto,
          puntuacion,
          totalPreguntas: preguntas.length,
          fechadia: fechaDia,
          fechahora: fechaHora
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los resultados');
      }

      setEnvioCompletado(true);
    } catch (error) {
      setError('Hubo un error al enviar los resultados. Por favor, inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const renderPantallaConfirmacion = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-green-600">
          <CheckCircle className="mr-2" />
          Certificación Enviada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base sm:text-lg mb-4">
          ¡Enhorabuena! Tu información ha sido enviada con éxito.
        </p>
        <p className="text-base sm:text-lg mb-6">
          Recibirás tu certificado autenticado en el correo electrónico: <strong>{email}</strong>
        </p>
        <Button onClick={onVolver} className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white">
          Volver a las actividades
        </Button>
      </CardContent>
    </Card>
  );

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
        <CardTitle className="flex items-center text-xl sm:text-2xl font-bold text-sociologia-700 mt-12">
          <HelpCircle className="mr-2" />
          Instrucciones del Test para Certificación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-sociologia-600">
          <li>Este test consta de 30 preguntas para comprobar tu aprendizaje.</li>
          <li>Necesitas obtener al menos un 80% de aciertos para obtener el certificado.</li>
          <li>Si apruebas, podrás solicitar que se te envíe un certificado por correo electrónico.</li>
          <li>Lee cada pregunta cuidadosamente y selecciona la mejor respuesta.</li>
          <li>No podrás volver a preguntas anteriores una vez respondidas.</li>
        </ol>
        <Button 
          onClick={() => setMostrarInstrucciones(false)} 
          className="mt-6 w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white text-lg px-6 py-3"
        >
          Comenzar el test
        </Button>
      </CardContent>
    </Card>
  );

  if (mostrarInstrucciones) {
    return renderInstrucciones();
  }

  if (cargando) {
    return <div>Cargando preguntas...</div>;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={onVolver} 
            variant="outline"
            className="mt-4 border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mostrarRevision) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Revisión de Respuestas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-base sm:text-lg">Has acertado {puntuacion} de {preguntas.length} preguntas.</p>
          {preguntas.map((pregunta, index) => {
            const respuestaUsuario = respuestas[index];
            const opcionUsuario = pregunta.opciones[respuestaUsuario];
            const esCorrecta = opcionUsuario && opcionUsuario.esCorrecta;
            return (
              <div key={index} className="mb-4 p-4 border rounded">
                <p className="font-bold text-sm sm:text-base">{pregunta.pregunta}</p>
                <p className={`text-sm sm:text-base ${esCorrecta ? "text-green-600" : "text-red-600"}`}>
                  Tu respuesta: {opcionUsuario ? opcionUsuario.texto : 'No respondida'}
                </p>
                {!esCorrecta && (
                  <p className="text-sm sm:text-base text-green-600">
                    Respuesta correcta: {pregunta.opciones.find(opcion => opcion.esCorrecta).texto}
                  </p>
                )}
              </div>
            );
          })}
          <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0">
            <Button onClick={() => setMostrarRevision(false)} className="w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white">
              Solicitar Certificado de resultados
            </Button>
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
    );
  }

  if (testCompletado) {
    const porcentajeAciertos = (puntuacion / preguntas.length) * 100;
    const aprobado = porcentajeAciertos >= 80;

    if (envioCompletado) {
      return renderPantallaConfirmacion();
    }

    return (
      <Card>
        {mostrarConfeti && <Confetti recycle={false} numberOfPieces={200} />}
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Resultados del Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-2xl sm:text-3xl font-bold mb-2">Porcentaje de aciertos: {porcentajeAciertos.toFixed(2)}%</p>
            <p className="text-lg sm:text-xl">Has acertado {puntuacion} de {preguntas.length} preguntas.</p>
          </div>
          {aprobado ? (
            <>
              <p className="text-xl sm:text-2xl text-green-600 mb-4">¡Felicidades! Has aprobado el test y puedes obtener tu certificado.</p>
              <Input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mb-2"
              />
              <Input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="mb-2"
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <Button onClick={enviarResultados} disabled={enviando} className="w-full sm:w-auto bg-sociologia-600 hover:bg-sociologia-700 text-white">
                  {enviando ? 'Enviando...' : 'Enviar solicitud de certificación'}
                </Button>
                <Button 
                  onClick={onVolver} 
                  variant="outline"
                  className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl sm:text-2xl text-red-600 mb-4">Lo siento, no has alcanzado el porcentaje necesario para obtener el certificado.</p>
              <p className="text-lg sm:text-xl mb-4">Necesitas un <span className="font-bold">80%</span> de aciertos para aprobar.</p>
              <Button 
                onClick={onVolver} 
                variant="outline"
                className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (preguntas.length === 0) {
    return <div className="text-center text-sociologia-600">No hay preguntas disponibles.</div>;
  }

  const preguntaActualData = preguntas[preguntaActual];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={onVolver} 
          variant="outline" 
          className="border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Test de Certificación - Pregunta {preguntaActual + 1} de {preguntas.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-base sm:text-lg">{preguntaActualData.pregunta}</p>
          {preguntaActualData.opciones.map((opcion, index) => (
            <Button
              key={index}
              onClick={() => handleRespuesta(index)}
              className="block w-full mb-2 bg-sociologia-500 hover:bg-sociologia-600 text-white text-left px-4 py-2 text-sm sm:text-base"
            >
              {opcion.texto}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCertificacion;