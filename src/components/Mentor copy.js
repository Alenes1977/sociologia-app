import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { HelpCircle, ArrowLeft, MessageCircle } from 'lucide-react';


const Mentor = ({ onVolver }) => {
  const [mostrarInstrucciones, setMostrarInstrucciones] = React.useState(true);

  const renderInstrucciones = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-sociologia-700">
          <HelpCircle className="mr-2" />
          Instrucciones para el Mentor Virtual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sociologia-600">
          <li>El Mentor Virtual es un chatbot especializado en los contenidos de este tema del curso de sociología.</li>
          <li>Puede responder preguntas, aclarar conceptos y proporcionar ejemplos y reflexiones relevantes.</li>
          <li>Utiliza los documentos del curso como fuente principal de información y conocimiento para responder a tus preguntas.</li>
          <li>Ofrece preguntas de seguimiento para profundizar en los temas discutidos.</li>
          <li>Es una herramienta ideal para reforzar tu comprensión, resolver dudas específicas y ampliar tu conocimiento y reflexión sobre estos contenidos... ¡pruébala!</li>
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
      
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-sociologia-700"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <img src="/images/mentor.webp" alt="Mentor Virtual" className="w-32 h-32 object-cover rounded-full" />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => window.open('https://chatgpt.com/g/g-KHgV0THMu-mentor-sociologico-tema-1-unav', '_blank')}
              className="bg-sociologia-600 hover:bg-sociologia-700 text-white flex items-center justify-center px-6 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              <MessageCircle className="mr-2" />
              <span className="sm:inline">Iniciar chat con el Mentor</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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

export default Mentor;