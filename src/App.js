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
import TestCertificacion from './components/TestCertificacion';
import Breadcrumbs from './components/Breadcrumbs';
import { temasData } from './dataTemas';
import TemaCard from './components/TemaCard';
import MapasMentales from './components/MapasMentales';
import VideosEducativos from './components/VideosEducativos';
import { GraduationCap, Brain, MessageCircleQuestion, Link, WholeWord, FlipVertical, GitBranch, TextSearch, Map, Video } from 'lucide-react';

const actividadesIconos = {
  quiz: Brain,
  flashcards: FlipVertical,
  asociacion: Link,
  cascada: MessageCircleQuestion,
  sopaletras: WholeWord,
  ahorcado: GitBranch,
  completarFrase: TextSearch,
  testCertificacion: GraduationCap,
  mapasMentales: Map,
  videosEducativos: Video,
};

const actividades = {
  contenidosEducativos: [
    { id: 'videosEducativos', nombre: "Videos educativos", componente: VideosEducativos, descripcion: "Visualiza los vídeos educativos sobre el tema", color: "from-blue-400 to-blue-600", imagen: "/images/videos.webp" },
    { id: 'mapasMentales', nombre: "Mapas Mentales", componente: MapasMentales, descripcion: "Visualiza mapas conceptuales interactivos", color: "from-green-400 to-green-600", imagen: "/images/mapamental.webp" },
  ],
  recursosAprendizaje: [
    { id: 'quiz', nombre: "Quiz interactivo", componente: QuizInteractivo, descripcion: "Pon a prueba tus conocimientos", color: "from-yellow-400 to-yellow-600", imagen: "/images/actividad1.webp" },
    { id: 'flashcards', nombre: "Flashcards", componente: Flashcards, descripcion: "Repasa conceptos clave", color: "from-red-400 to-red-600", imagen: "/images/actividad2.webp" },
    { id: 'asociacion', nombre: "Asociación de conceptos", componente: JuegoAsociacion, descripcion: "Conecta conceptos relacionados", color: "from-indigo-400 to-indigo-600", imagen: "/images/actividad3.webp" },
    { id: 'cascada', nombre: "Cascada de preguntas", componente: PreguntasCascada, descripcion: "Avanza por el torrente y gana", color: "from-pink-400 to-pink-600", imagen: "/images/actividad4.webp" },
    { id: 'sopaletras', nombre: "Sopa de letras", componente: SopaLetras, descripcion: "Encuentra palabras ocultas", color: "from-purple-400 to-purple-600", imagen: "/images/actividad5.webp" },
    { id: 'ahorcado', nombre: "Ahorcado", componente: Ahorcado, descripcion: "Adivina la palabra oculta", color: "from-teal-400 to-teal-600", imagen: "/images/actividad6.webp" },
    { id: 'completarFrase', nombre: "Completar la frase", componente: CompletarFrase, descripcion: "Completa las frases con la palabra correcta", color: "from-orange-400 to-orange-600", imagen: "/images/actividad7.webp" },
  ],
  certificaAprendizaje: [
    { id: 'testCertificacion', nombre: "Test para Certificación", componente: TestCertificacion, descripcion: "Realiza un test para obtener tu certificado de este tema del curso", color: "from-gray-400 to-gray-600", imagen: "/images/certificado.webp" },
  ],
};

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

  const renderActividadesSection = (title, actividadesArray) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-sociologia-700 border-b-2 border-sociologia-300 pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actividadesArray.map((actividad) => {
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
    </div>
  );

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
        <div className="space-y-8">
          <div className="bg-sociologia-100 p-6 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-2 text-sociologia-800">{temaSeleccionado.nombre}</h1>
            <h2 className="text-2xl font-semibold text-sociologia-600">{temaSeleccionado.subtitulo}</h2>
          </div>
          {renderActividadesSection("Contenidos educativos", actividades.contenidosEducativos)}
          {renderActividadesSection("Recursos de aprendizaje", actividades.recursosAprendizaje)}
          {renderActividadesSection("Certifica tu aprendizaje", actividades.certificaAprendizaje)}
          <Button onClick={volverAlInicio} className="mt-8 bg-sociologia-600 hover:bg-sociologia-700">Volver a la selección de temas</Button>
        </div>
      );
    }

    return (
      <>
        <h1 className="text-5xl font-bold mb-10 text-center text-sociologia-800">Curso de Sociología, UNAV</h1>
        <h1 className="text-3xl font-bold mb-10 text-center text-sociologia-800">Prof. Alejandro Néstor García Martínez</h1>
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
    <div className="container mx-auto p-8 bg-gradient-to-b from-sociologia-50 to-sociologia-100 min-h-screen">
      <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleBreadcrumbNavigation} />
      {!temaSeleccionado && !actividadSeleccionada && (
        <div className="relative mb-8">
          <img src="/images/portada.webp" alt="Portada del Curso" className="w-full h-64 object-cover rounded-lg shadow-lg" style={{ objectPosition: 'center 20%' }} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <h1 className="text-4xl font-bold text-white text-center">Bienvenido a los recursos de aprendizaje para:</h1>
          </div>
        </div>
      )}
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;