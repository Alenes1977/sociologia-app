import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sociologia-100 to-sociologia-200 text-sociologia-800 py-2.5 shadow-sm">
      <div className="container mx-auto px-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <BookOpen className="h-6 w-6 text-sociologia-600 group-hover:text-sociologia-800 transition-colors duration-300" />
          <div className="flex items-baseline space-x-3">
            <h1 className="text-lg font-semibold leading-tight">Curso de Sociología</h1>
            <p className="text-sm text-sociologia-600 group-hover:text-sociologia-800 transition-colors duration-300">UNAV</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
