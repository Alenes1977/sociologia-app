import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TemaCard = ({ tema, index, onClick }) => {
  const gradientColors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-red-400 to-red-600"
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card 
        className={`cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${gradientColors[index % 5]} text-white relative group overflow-hidden`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 z-10"></div>
        <img 
          src={tema.imagen} 
          alt={tema.nombre} 
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-0"
        />
        <CardHeader className="relative z-20">
          <CardTitle className="text-2xl font-bold drop-shadow-lg">{tema.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-20">
          <p className="text-lg font-semibold mb-4 drop-shadow-lg">{tema.subtitulo}</p>
          
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TemaCard;