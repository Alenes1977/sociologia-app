import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items, onNavigate }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <a
              href="#"
              className={`inline-flex items-center text-sm font-medium ${
                index === items.length - 1
                  ? 'text-sociologia-600'
                  : 'text-gray-700 hover:text-sociologia-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(index);
              }}
            >
              {item}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;