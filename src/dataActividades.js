// src/dataActividades.js

import { Headphones, GraduationCap, Brain, MessageCircleQuestion, Link, WholeWord, FlipVertical, GitBranch, TextSearch, Map, Video, MessageCircle } from 'lucide-react';
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

// Iconos para las actividades
export const actividadesIconos = {
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
  mentor: MessageCircle,
  podcast: Headphones,
};

// Definición de actividades agrupadas por categorías
export const actividades = {
  contenidosEducativos: [
    { id: 'videosEducativos', nombre: "Videos educativos", componente: VideosEducativos, descripcion: "Visualiza los vídeos educativos sobre el tema", color: "from-gray-400 to-gray-600", imagen: "/images/videos.webp" },
    { id: 'mapasMentales', nombre: "Mapas Mentales", componente: MapasMentales, descripcion: "Visualiza mapas conceptuales interactivos", color: "from-gray-400 to-gray-600", imagen: "/images/mapamental.webp" },
    { id: 'mentor', nombre: "Mentor Virtual", componente: Mentor, descripcion: "Chatea para resolver tus dudas sobre los contenidos del tema", color: "from-gray-400 to-gray-600", imagen: "/images/mentorvirtual.webp" },
    { id: 'podcast', nombre: "Podcasts", componente: Podcast, descripcion: "Escucha podcasts relacionados con el tema", color: "from-gray-400 to-gray-600", imagen: "/images/podcast.webp" },
  ],
  recursosAprendizaje: [
    { id: 'quiz', nombre: "Quiz interactivo", componente: QuizInteractivo, descripcion: "Pon a prueba tus conocimientos", color: "from-blue-400 to-blue-600", imagen: "/images/actividad1.webp" },
    { id: 'flashcards', nombre: "Flashcards", componente: Flashcards, descripcion: "Repasa conceptos clave", color: "from-green-400 to-green-600", imagen: "/images/actividad2.webp" },
    { id: 'asociacion', nombre: "Asociación de conceptos", componente: JuegoAsociacion, descripcion: "Conecta conceptos relacionados", color: "from-pink-400 to-pink-600", imagen: "/images/actividad3.webp" },
    { id: 'cascada', nombre: "Cascada de preguntas", componente: PreguntasCascada, descripcion: "Avanza por el torrente y gana", color: "from-yellow-400 to-yellow-600", imagen: "/images/actividad4.webp" },
    { id: 'sopaletras', nombre: "Sopa de letras", componente: SopaLetras, descripcion: "Encuentra palabras ocultas", color: "from-teal-400 to-teal-600", imagen: "/images/actividad5.webp" },
    { id: 'ahorcado', nombre: "Ahorcado", componente: Ahorcado, descripcion: "Adivina la palabra oculta", color: "from-purple-400 to-purple-600", imagen: "/images/actividad6.webp" },
    { id: 'completarFrase', nombre: "Completar la frase", componente: CompletarFrase, descripcion: "Completa las frases con la palabra correcta", color: "from-orange-400 to-orange-600", imagen: "/images/actividad7.webp" },
  ],
  certificaAprendizaje: [
    { id: 'testCertificacion', nombre: "Test para Certificación", componente: TestCertificacion, descripcion: "Realiza un test para obtener tu certificado de este tema del curso", color: "from-gray-400 to-gray-600", imagen: "/images/certificado.webp" },
  ],
};
