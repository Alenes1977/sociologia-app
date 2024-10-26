// src/components/Breadcrumbs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { temasData } from '../dataTemas';
import { actividades } from '../dataActividades'; // Importar actividades desde dataActividades.js
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbLinks = [];

  // Home siempre está presente
  breadcrumbLinks.push({ name: 'Home', to: '/', icon: Home });

  // Añadir Tema si existe
  if (pathnames.length >= 2 && pathnames[0] === 'tema') {
    const temaId = pathnames[1];
    const tema = temasData[temaId];
    if (tema) {
      breadcrumbLinks.push({ name: tema.titulo, to: `/tema/${temaId}` });
    }
  }

  // Añadir Actividad si existe
  if (pathnames.length === 3 && pathnames[0] === 'tema') {
    const actividadId = pathnames[2];
    const allActividades = actividades.contenidosEducativos
      .concat(actividades.recursosAprendizaje, actividades.certificaAprendizaje);
    const actividad = allActividades.find(act => act.id === actividadId);
    if (actividad) {
      breadcrumbLinks.push({ name: actividad.nombre, to: location.pathname });
    }
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-2 bg-white shadow-md rounded-full px-4 py-2">
        {breadcrumbLinks.map((breadcrumb, index) => {
          const isLast = index === breadcrumbLinks.length - 1;
          return (
            <motion.li
              key={breadcrumb.to}
              className="flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {!isLast ? (
                <>
                  <Link
                    to={breadcrumb.to}
                    className="text-sociologia-600 hover:text-sociologia-800 transition-colors duration-200 flex items-center"
                  >
                    {index === 0 && <breadcrumb.icon className="w-4 h-4 mr-1" />}
                    <span className="text-sm font-medium">{breadcrumb.name}</span>
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-2 text-sociologia-400" />
                </>
              ) : (
                <span className="text-sociologia-800 font-semibold text-sm flex items-center">
                  {index === 0 && <breadcrumb.icon className="w-4 h-4 mr-1" />}
                  {breadcrumb.name}
                </span>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
