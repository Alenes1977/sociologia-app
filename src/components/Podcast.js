import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, X, ArrowLeft } from 'lucide-react';
import { temasData } from '../dataTemas';

const Podcast = ({ temaId, onVolver }) => {
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [podcastSeleccionado, setPodcastSeleccionado] = useState(null);
  const [podcastsDelTema, setPodcastsDelTema] = useState([]);

  useEffect(() => {
    const temaActual = temasData[temaId];
    if (temaActual && temaActual.podcasts) {
      setPodcastsDelTema(temaActual.podcasts);
    } else {
      setPodcastsDelTema([]);
    }
  }, [temaId]);

  const renderInstrucciones = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones para los Podcasts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sociologia-600">
          <li>Estos podcasts están diseñados para complementar tu aprendizaje sobre los conceptos clave de este tema.</li>
          <li>Puedes pausar, reiniciar o ajustar el volumen del podcast según tus necesidades.</li>
          <li>Toma notas mientras escuchas los podcasts para reforzar tu comprensión del tema.</li>
          <li>Puedes cerrar el reproductor en cualquier momento para volver a la lista de podcasts disponibles.</li>
          <li>También puedes descargar el podcast en tu dispositivo para escucharlo en cualquier momento.</li>
        </ul>
        <Button 
          onClick={() => setMostrarInstrucciones(false)} 
          className="mt-4 bg-sociologia-600 hover:bg-sociologia-700 text-white"
        >
          Entendido
        </Button>
      </CardContent>
    </Card>
  );

  const renderPodcastSeleccionado = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-sociologia-700">{podcastSeleccionado.titulo}</h2>
          <Button onClick={() => setPodcastSeleccionado(null)} variant="ghost">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-4">
          <audio
            src={podcastSeleccionado.url}
            controls
            autoPlay
            className="w-full"
          >
            Tu navegador no soporta el elemento de audio.
          </audio>
          <div className="flex justify-end mt-4">
            <a 
              href={podcastSeleccionado.url} 
              download={podcastSeleccionado.titulo} 
              className="bg-sociologia-600 hover:bg-sociologia-700 text-white py-2 px-4 rounded"
            >
              Descargar Podcast
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={onVolver} 
          variant="outline" 
          className="w-full sm:w-auto border-sociologia-400 text-sociologia-600 hover:bg-sociologia-100 transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Actividades
        </Button>
      </div>

      {mostrarInstrucciones && renderInstrucciones()}
      {podcastsDelTema.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {podcastsDelTema.map((podcast) => (
            <Card key={podcast.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-sociologia-700">{podcast.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sociologia-600">{podcast.descripcion}</p>
                <Button
                  onClick={() => setPodcastSeleccionado(podcast)}
                  className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white"
                >
                  Escuchar Podcast
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-sociologia-600">No hay podcasts disponibles para este tema.</p>
      )}
      {podcastSeleccionado && renderPodcastSeleccionado()}

      <div className="flex justify-end mt-6">
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
};

export default Podcast;