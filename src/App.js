// src/App.js
import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import TemaCard from './components/TemaCard';
import QuizInteractivo from './components/QuizInteractivo';
import Flashcards from './components/Flashcards';
import JuegoAsociacion from './components/JuegoAsociacion';
import SopaLetras from './components/SopaLetras';
import PreguntasCascada from './components/PreguntasCascada';
import Ahorcado from './components/Ahorcado';
import CompletarFrase from './components/CompletarFrase';
import TestCertificacion from './components/TestCertificacion';
import MapasMentales from './components/MapasMentales';
import VideosEducativos from './components/VideosEducativos';
import Mentor from './components/Mentor';
import Podcast from './components/Podcast';
import { temasData } from './dataTemas';
import { actividades, actividadesIconos } from './dataActividades';
import { Button } from "./components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
// Elimina esta línea si no estás usando ScrollToTop
// import ScrollToTop from './utils/scrollToTop';

const App = () => {
  const navigate = useNavigate();

  // Obtener la lista de temas
  const temas = Object.keys(temasData).map(id => ({
    id: parseInt(id),
    nombre: temasData[id].titulo,
    subtitulo: temasData[id].subtitulo,
    imagen: `/images/tema${id}.webp`
  }));

  // Página de inicio
  const Home = () => (
    <>
      <div className="relative mb-12">
        <div className="h-64 md:h-96 lg:h-80 overflow-hidden rounded-lg shadow-lg relative">
          <img 
            src="/images/portada.webp" 
            alt="Portada del curso de Sociología" 
            className="absolute w-full h-full object-cover object-center lg:object-top lg:left-1/4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sociologia-900 via-sociologia-800 to-transparent opacity-80"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Curso de Sociología, UNAV</h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-sociologia-100 drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)]">Prof. Alejandro Néstor García Martínez</h2>
        </div>
      </div>
      <p className="mb-12 text-xl md:text-2xl text-center text-sociologia-600">Explora los temas de la asignatura y desafía tu conocimiento de una manera entretenida</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {temas.map((tema, index) => (
          <TemaCard
            key={tema.id}
            tema={tema}
            index={index}
            onClick={() => navigate(`/tema/${tema.id}`)}
          />
        ))}
      </div>
    </>
  );

  // Detalle del tema
  const TemaDetalle = () => {
    const { temaId } = useParams();
    const tema = temasData[temaId];

    if (!tema) {
      return <div className="text-center text-red-500 text-xl">Tema no encontrado</div>;
    }

    // Función para seleccionar una actividad y navegar a su ruta
    const seleccionarActividad = (actividadId) => {
      navigate(`/tema/${temaId}/${actividadId}`);
    };

    // Función para renderizar cada sección de actividades
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
                  onClick={() => seleccionarActividad(actividad.id)}
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

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-sociologia-800 to-sociologia-600 py-6 px-8 rounded-xl shadow-2xl relative overflow-hidden w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 transform -skew-y-12"></div>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-2 text-white relative z-10 tracking-tight leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {tema.nombre}
            </h1>
            <h2 className="text-xl font-semibold text-sociologia-100 relative z-10 pl-4 border-l-4 border-sociologia-300 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
              {tema.subtitulo}
            </h2>
          </div>
        </div>
        {renderActividadesSection("Contenidos educativos", actividades.contenidosEducativos)}
        {renderActividadesSection("Recursos de aprendizaje", actividades.recursosAprendizaje)}
        {renderActividadesSection("Certifica tu aprendizaje", actividades.certificaAprendizaje)}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="border-sociologia-400 bg-sociologia-600 hover:bg-sociologia-700 text-white hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm py-2 px-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la selección de temas
          </Button>
        </div>
      </div>
    );
  };

  // Componente para manejar las actividades basadas en la URL
  const Actividad = () => {
    const { temaId, actividadId } = useParams();
    const navigate = useNavigate();
    const tema = temasData[temaId];

    if (!tema) {
      return <div className="text-center text-red-500 text-xl">Tema no encontrado</div>;
    }

    // Mapeo de actividades para seleccionar el componente adecuado
    const actividadesMap = {
      quiz: QuizInteractivo,
      flashcards: Flashcards,
      asociacion: JuegoAsociacion,
      cascada: PreguntasCascada,
      sopaletras: SopaLetras,
      ahorcado: Ahorcado,
      completarFrase: CompletarFrase,
      testCertificacion: TestCertificacion,
      mapasMentales: MapasMentales,
      videosEducativos: VideosEducativos,
      mentor: Mentor,
      podcast: Podcast,
    };

    const ComponenteActividad = actividadesMap[actividadId];

    if (!ComponenteActividad) {
      return <div className="text-center text-red-500 text-xl">Actividad no encontrada</div>;
    }

    // Obtener el nombre de la actividad para el título
    const actividadNombre = actividades.contenidosEducativos
      .concat(actividades.recursosAprendizaje, actividades.certificaAprendizaje)
      .find(act => act.id === actividadId)?.nombre || actividadId;

    return (
      <>
        <h1 className="text-4xl font-bold mb-6 text-sociologia-700">{tema.nombre} - {actividadNombre}</h1>
        <div className="flex justify-center">
          <ComponenteActividad temaId={parseInt(temaId)} onVolver={() => navigate(`/tema/${temaId}`)} />
        </div>
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-8 bg-gradient-to-b from-sociologia-50 to-sociologia-100 min-h-screen">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tema/:temaId" element={<TemaDetalle />} />
          <Route path="/tema/:temaId/:actividadId" element={<Actividad />} />
          <Route path="*" element={<div className="text-center text-red-500 text-xl">Página no encontrada</div>} />
        </Routes>
        <Analytics />
      </div>
      <Footer />
    </>
  );
};

export default App;
