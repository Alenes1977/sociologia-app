import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, X } from 'lucide-react';
import { temasData } from '../dataTemas';

const MapasMentales = ({ temaId }) => {
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [mapaSeleccionado, setMapaSeleccionado] = useState(null);
  const [mapasDelTema, setMapasDelTema] = useState([]);

  useEffect(() => {
    const temaActual = temasData[temaId];
    if (temaActual && temaActual.mapasMentales) {
      setMapasDelTema(temaActual.mapasMentales);
    } else {
      setMapasDelTema([]);
    }
  }, [temaId]);

  const renderInstrucciones = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones para los Mapas Conceptuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sociologia-600">
          <li>Estos mapas conceptuales interactivos están diseñados para ayudarte a repasar los contenidos fundamentales de este tema específico.</li>
          <li>Haz clic en "Ver Mapa Mental" para abrir el mapa directamente en esta página.</li>
          <li>Utiliza estos mapas para visualizar las relaciones entre los conceptos clave y reforzar tu comprensión del tema.</li>
          <li>Puedes cerrar el mapa en cualquier momento para volver a la lista de mapas disponibles.</li>
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

  const renderMapaSeleccionado = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-sociologia-700">{mapaSeleccionado.titulo}</h2>
          <Button onClick={() => setMapaSeleccionado(null)} variant="ghost">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-grow">
          <iframe
            src={mapaSeleccionado.url}
            title={mapaSeleccionado.titulo}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {mostrarInstrucciones && renderInstrucciones()}
      {mapasDelTema.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mapasDelTema.map((mapa) => (
            <Card key={mapa.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-sociologia-700">{mapa.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setMapaSeleccionado(mapa)}
                  className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white"
                >
                  Ver Mapa Mental
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-sociologia-600">No hay mapas conceptuales disponibles para este tema.</p>
      )}
      {mapaSeleccionado && renderMapaSeleccionado()}
    </div>
  );
};

export default MapasMentales;