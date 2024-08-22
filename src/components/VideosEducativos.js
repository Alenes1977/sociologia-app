import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, X, ArrowLeft } from 'lucide-react';
import { temasData } from '../dataTemas';

const VideosEducativos = ({ temaId, onVolver }) => {
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [videoSeleccionado, setVideoSeleccionado] = useState(null);
  const [videosDelTema, setVideosDelTema] = useState([]);

  useEffect(() => {
    const temaActual = temasData[temaId];
    if (temaActual && temaActual.videosEducativos) {
      setVideosDelTema(temaActual.videosEducativos);
    } else {
      setVideosDelTema([]);
    }
  }, [temaId]);

  const renderInstrucciones = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones para los Vídeos Educativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sociologia-600">
          <li>Estos vídeos educativos están diseñados para complementar tu aprendizaje sobre los conceptos clave de este tema.</li>
          <li>Puedes pausar, reiniciar o ajustar el volumen del vídeo según tus necesidades.</li>
          <li>Toma notas mientras ves los vídeos para reforzar tu comprensión del tema.</li>
          <li>Puedes cerrar el vídeo en cualquier momento para volver a la lista de vídeos disponibles.</li>
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

  const renderVideoSeleccionado = () => {
    let videoSrc = videoSeleccionado.url;
    let iframeProps = {};
    
    if (videoSeleccionado.tipo === 'youtube') {
      const videoId = videoSeleccionado.url.split('v=')[1];
      if(videoId) {
        const ampersandPosition = videoId.indexOf('&');
        if(ampersandPosition !== -1) {
          videoSrc = `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
        } else {
          videoSrc = `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } else if (videoSeleccionado.tipo === 'panopto') {
      const videoId = videoSeleccionado.url.split('id=')[1];
      videoSrc = `https://unav.cloud.panopto.eu/Panopto/Pages/Embed.aspx?id=${videoId}&autoplay=true&offerviewer=false&showtitle=true&showbrand=false&captions=false&interactivity=search`;
      iframeProps = {
        style: { border: "1px solid #464646" },
        allow: "autoplay",
        "aria-label": "Reproductor de vídeo Panopto incrustado",
        "aria-description": videoSeleccionado.titulo
      };
    } else if (videoSeleccionado.tipo === 'servidor') {
      iframeProps = {
        autoPlay: true,
        muted: true,
        playsInline: true,
        allow: "autoplay",
      };
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-sociologia-700">{videoSeleccionado.titulo}</h2>
            <Button onClick={() => setVideoSeleccionado(null)} variant="ghost">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-grow">
            {videoSeleccionado.tipo === 'servidor' ? (
              <video
                src={videoSrc}
                className="w-full h-full"
                controls
                autoPlay
                muted
                playsInline
              />
            ) : (
              <iframe
                src={videoSrc}
                title={videoSeleccionado.titulo}
                className="w-full h-full border-0"
                allowFullScreen
                {...iframeProps}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const getThumbnailUrl = (video) => {
    if (video.tipo === 'youtube') {
      const videoId = video.url.split('v=')[1];
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    } else {
      return video.thumbnail ? `/thumbnails/${video.thumbnail}` : '/thumbnails/default-thumbnail.jpg';
    }
  };

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
      {videosDelTema.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videosDelTema.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-sociologia-700">{video.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative w-full pt-[56.25%]">
                  <img
                    src={getThumbnailUrl(video)}
                    alt={`Miniatura de ${video.titulo}`}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                  />
                </div>
                <Button
                  onClick={() => setVideoSeleccionado(video)}
                  className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white"
                >
                  Ver Vídeo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-sociologia-600">No hay vídeos educativos disponibles para este tema.</p>
      )}
      {videoSeleccionado && renderVideoSeleccionado()}

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

export default VideosEducativos;