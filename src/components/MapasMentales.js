import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink } from 'lucide-react';

const MapasMentales = ({ temaId }) => {
  const mapas = [
    {
      id: 'sociologia',
      titulo: '¿Qué es la sociología?',
      url: 'https://aprendizajeconia.com/sociologiaUNAV/sociologia.html'
    },
    {
      id: 'condicionsociocultural',
      titulo: 'Condición sociocultural del ser humano',
      url: 'https://aprendizajeconia.com/sociologiaUNAV/condicionsociocultural.html'
    },
    {
      id: 'perspectivarelacional',
      titulo: 'La perspectiva relacional en la sociología',
      url: 'https://aprendizajeconia.com/sociologiaUNAV/perspectivarelacional.html'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mapas.map((mapa) => (
        <Card key={mapa.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sociologia-700">{mapa.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.open(mapa.url, '_blank', 'noopener,noreferrer')}
              className="w-full bg-sociologia-600 hover:bg-sociologia-700 text-white"
            >
              Ver Mapa Mental <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MapasMentales;