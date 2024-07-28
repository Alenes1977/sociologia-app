import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { temasData } from '../dataTemas';
import Confetti from 'react-confetti';
import { HelpCircle, CheckCircle } from 'lucide-react';

const TestCertificacion = ({ temaId, onVolver }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [testCompletado, setTestCompletado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);
  const [nombre, setNombre] = useState('');
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
          .slice(0, 30) // Cambiado a 30 preguntas
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

    console.log(`Pregunta actual: ${preguntaActual}`);
    console.log(`Respuesta seleccionada: ${respuestaIndex}`);

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

      console.log(`Pregunta ${index + 1}: ${pregunta.pregunta}`);
      console.log(`Respuesta del usuario: ${opcionUsuario ? opcionUsuario.texto : 'No respondida'}`);
      console.log(`Es correcta: ${esCorrecta ? 'Sí' : 'No'}`);

      return total + (esCorrecta ? 1 : 0);
    }, 0);

    console.log('Total de aciertos:', aciertos);
    setPuntuacion(aciertos);
    setTestCompletado(true);
    setMostrarRevision(true);

    if ((aciertos / preguntas.length) >= 0.8) {
      setMostrarConfeti(true);
    }
  };

  useEffect(() => {
    console.log('Estado de respuestas:', respuestas);
  }, [respuestas]);

  const enviarResultados = async () => {
    if (!nombre || !email) {
      setError('Por favor, introduce tu nombre y email.');
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
        <CardTitle className="flex items-center text-2xl font-bold text-green-600">
          <CheckCircle className="mr-2" />
          Certificación Enviada
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">
          ¡Enhorabuena! Tu información ha sido enviada con éxito.
        </p>
        <p className="text-lg mb-6">
          Recibirás tu certificado autenticado en el correo electrónico: <strong>{email}</strong>
        </p>
        <Button onClick={onVolver} className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white">
          Volver a las actividades
        </Button>
      </CardContent>
    </Card>
  );

  const renderInstrucciones = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones del Test para Certificación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal list-inside space-y-2 text-sociologia-600">
          <li>Este test consta de 30 preguntas para comprobar tu aprendizaje.</li>
          <li>Necesitas obtener al menos un 80% de aciertos para obtener el certificado.</li>
          <li>Si apruebas, podrás solicitar que se te envíe un certificado por correo electrónico.</li>
          <li>Lee cada pregunta cuidadosamente y selecciona la mejor respuesta.</li>
          <li>No podrás volver a preguntas anteriores una vez respondidas.</li>
        </ol>
        <Button 
          onClick={() => setMostrarInstrucciones(false)} 
          className="mt-6 bg-sociologia-600 hover:bg-sociologia-700 text-white"
        >
          Comenzar el test
        </Button>
      </CardContent>
    </Card>
  );

  const renderRevision = () => (
    <Card>
      <CardHeader>
        <CardTitle>Revisión de Respuestas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Has acertado {puntuacion} de {preguntas.length} preguntas.</p>
        {preguntas.map((pregunta, index) => {
          const respuestaUsuario = respuestas[index];
          const opcionUsuario = pregunta.opciones[respuestaUsuario];
          const esCorrecta = opcionUsuario && opcionUsuario.esCorrecta;
          return (
            <div key={index} className="mb-4 p-4 border rounded">
              <p className="font-bold">{pregunta.pregunta}</p>
              <p className={esCorrecta ? "text-green-600" : "text-red-600"}>
                Tu respuesta: {opcionUsuario ? opcionUsuario.texto : 'No respondida'}
              </p>
              {!esCorrecta && (
                <p className="text-green-600">
                  Respuesta correcta: {pregunta.opciones.find(opcion => opcion.esCorrecta).texto}
                </p>
              )}
            </div>
          );
        })}
        <div className="flex justify-between mt-6">
          <Button onClick={() => setMostrarRevision(false)} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
            Continuar
          </Button>
          <Button onClick={onVolver} className="bg-gray-400 hover:bg-gray-500 text-white">
            Volver a las actividades
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (cargando) {
    return <div>Cargando preguntas...</div>;
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button onClick={onVolver} className="mt-4 bg-sociologia-600 hover:bg-sociologia-700 text-white">
            Volver a las actividades
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mostrarInstrucciones) {
    return renderInstrucciones();
  }

  if (mostrarRevision) {
    return renderRevision();
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
          <CardTitle>Resultados del Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-3xl font-bold mb-2">Porcentaje de aciertos: {porcentajeAciertos.toFixed(2)}%</p>
            <p className="text-xl">Has acertado {puntuacion} de {preguntas.length} preguntas.</p>
          </div>
          {aprobado ? (
            <>
              <p className="text-2xl text-green-600 mb-4">¡Felicidades! Has aprobado el test y puedes obtener tu certificado.</p>
              <Input
                type="text"
                placeholder="Nombre y apellidos completos"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
              <div className="flex justify-between">
                <Button onClick={enviarResultados} disabled={enviando} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
                  {enviando ? 'Enviando...' : 'Certificar resultados'}
                </Button>
                <Button onClick={onVolver} className="bg-gray-400 hover:bg-gray-500 text-white">
                  Volver
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl text-red-600 mb-4">Lo siento, no has alcanzado el porcentaje necesario para obtener el certificado.</p>
              <p className="text-xl mb-4">Necesitas un <span className="font-bold">80%</span> de aciertos para aprobar.</p>
              <Button onClick={onVolver} className="bg-sociologia-600 hover:bg-sociologia-700 text-white">
                Volver a las actividades
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (preguntas.length === 0) {
    return <div>No hay preguntas disponibles.</div>;
  }

  const preguntaActualData = preguntas[preguntaActual];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test de Certificación - Pregunta {preguntaActual + 1} de {preguntas.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{preguntaActualData.pregunta}</p>
        {preguntaActualData.opciones.map((opcion, index) => (
          <Button
            key={index}
            onClick={() => handleRespuesta(index)}
            className="block w-full mb-2 bg-sociologia-500 hover:bg-sociologia-600 text-white"
          >
            {opcion.texto}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default TestCertificacion;