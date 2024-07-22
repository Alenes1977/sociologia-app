import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import QuizInteractivo from './components/QuizInteractivo';
import Flashcards from './components/Flashcards';
import JuegoAsociacion from './components/JuegoAsociacion';
import SopaLetras from './components/SopaLetras';
import PreguntasCascada from './components/PreguntasCascada';
import Ahorcado from './components/Ahorcado';
import CompletarFrase from './components/CompletarFrase';
import Breadcrumbs from './components/Breadcrumbs';
import { temasData } from './dataTemas';
import TemaCard from './components/TemaCard';
import { Brain, MessageCircleQuestion, Link, WholeWord, FlipVertical, GitBranch, TextSearch } from 'lucide-react';

const actividadesIconos = {
  quiz: Brain,
  flashcards: FlipVertical,
  asociacion: Link,
  cascada: MessageCircleQuestion,
  sopaletras: WholeWord,
  ahorcado: GitBranch,
  completarFrase: TextSearch
};

const actividades = [
  { id: 'quiz', nombre: "Quiz interactivo", componente: QuizInteractivo, descripcion: "Pon a prueba tus conocimientos", color: "from-blue-400 to-blue-600", imagen: "/images/actividad1.webp" },
  { id: 'flashcards', nombre: "Flashcards", componente: Flashcards, descripcion: "Repasa conceptos clave", color: "from-green-400 to-green-600", imagen: "/images/actividad2.webp" },
  { id: 'asociacion', nombre: "Asociación de conceptos", componente: JuegoAsociacion, descripcion: "Conecta conceptos relacionados", color: "from-yellow-400 to-yellow-600", imagen: "/images/actividad3.webp" },
  { id: 'cascada', nombre: "Cascada de preguntas", componente: PreguntasCascada, descripcion: "Avanza por el torrente y gana", color: "from-red-400 to-red-600", imagen: "/images/actividad5.webp" },
  { id: 'sopaletras', nombre: "Sopa de letras", componente: SopaLetras, descripcion: "Encuentra palabras ocultas", color: "from-indigo-400 to-indigo-600", imagen: "/images/actividad6.webp" },
  { id: 'ahorcado', nombre: "Ahorcado", componente: Ahorcado, descripcion: "Adivina la palabra oculta", color: "from-pink-400 to-pink-600", imagen: "/images/actividad7.webp" },
  { id: 'completarFrase', nombre: "Completar la frase", componente: CompletarFrase, descripcion: "Completa las frases con la palabra correcta", color: "from-teal-400 to-teal-600", imagen: "/images/actividad8.webp" },
];

const App = () => {
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  const temas = Object.keys(temasData).map(id => ({
    id: parseInt(id),
    nombre: temasData[id].titulo,
    subtitulo: temasData[id].subtitulo,
    imagen: `/images/tema${id}.webp`
  }));

  const seleccionarTema = (tema) => {
    setTemaSeleccionado(tema);
    setActividadSeleccionada(null);
  };

  const seleccionarActividad = (actividad) => {
    setActividadSeleccionada(actividad);
  };

  const volverAlInicio = () => {
    setTemaSeleccionado(null);
    setActividadSeleccionada(null);
  };

  const volverAtras = () => {
    if (actividadSeleccionada) {
      setActividadSeleccionada(null);
    } else if (temaSeleccionado) {
      setTemaSeleccionado(null);
    }
  };

  const getBreadcrumbs = () => {
    const items = ['Home'];
    if (temaSeleccionado) {
      items.push(temaSeleccionado.nombre);
    }
    if (actividadSeleccionada) {
      items.push(actividadSeleccionada.nombre);
    }
    return items;
  };

  const handleBreadcrumbNavigation = (index) => {
    if (index === 0) {
      volverAlInicio();
    } else if (index === 1 && temaSeleccionado) {
      setActividadSeleccionada(null);
    }
  };

  const renderContent = () => {
    if (actividadSeleccionada) {
      const ComponenteActividad = actividadSeleccionada.componente;
      return (
        <>
          <h1 className="text-4xl font-bold mb-6 text-sociologia-700">{temaSeleccionado.nombre} - {actividadSeleccionada.nombre}</h1>
          <div className="flex justify-center">
            <ComponenteActividad temaId={temaSeleccionado.id} onVolver={volverAtras} />
          </div>
        </>
      );
    }

    if (temaSeleccionado) {
      return (
        <>
          <h1 className="text-4xl font-bold mb-6 text-sociologia-600">Actividades para: <span className="text-sociologia-700">{temaSeleccionado.nombre}</span></h1>
          <h2 className="text-3xl font-bold mb-6 text-sociologia-700">{temaSeleccionado.subtitulo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actividades.map((actividad) => {
              const Icon = actividadesIconos[actividad.id];
              return (
                <motion.div
                  key={actividad.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${actividad.color} text-white relative group overflow-hidden`}
                    onClick={() => seleccionarActividad(actividad)}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-10"></div>
                    <img src={actividad.imagen} alt={actividad.nombre} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-0" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-20">
                      <CardTitle className="text-2xl font-bold drop-shadow-lg">{actividad.nombre}</CardTitle>
                      <Icon className="h-8 w-8 drop-shadow-lg" />
                    </CardHeader>
                    <CardContent className="relative z-20">
                      <p className="text-lg drop-shadow-lg">{actividad.descripcion}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <Button onClick={volverAlInicio} className="mt-8 bg-sociologia-600 hover:bg-sociologia-700">Volver a la selección de temas</Button>
        </>
      );
    }

    return (
      <>
        <h1 className="text-5xl font-bold mb-10 text-center text-sociologia-800">Bienvenido al Repaso de Sociología</h1>
        <p className="mb-12 text-2xl text-center text-sociologia-600">Explora los temas de la asignatura y desafía tu conocimiento de una manera entretenida:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {temas.map((tema, index) => (
            <TemaCard
              key={tema.id}
              tema={tema}
              index={index}
              onClick={() => seleccionarTema(tema)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-b from-sociologia-100 to-sociologia-200 min-h-screen">
      <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleBreadcrumbNavigation} />
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;