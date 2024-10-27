import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-sociologia-200 to-sociologia-100 text-sociologia-800 py-3 shadow-sm mt-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-5 w-5 text-sociologia-600" />
          <span className="text-sm">Curso de Sociología UNAV</span>
        </div>
        <div className="flex items-center space-x-3">
          <img src="/logo192.webp" alt="Logo" className="h-5 w-5" />
          <span className="text-sm">&copy; {new Date().getFullYear()} Alejandro Néstor</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
