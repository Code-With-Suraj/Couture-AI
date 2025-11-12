import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button onClick={onHomeClick} className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
          <LogoIcon className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Roopix<span className="text-indigo-600"> AI</span>
          </h1>
        </button>
      </div>
    </header>
  );
};

export default Header;