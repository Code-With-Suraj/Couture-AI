
import React from 'react';
import { SparklesIcon } from './icons';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
        <div className="absolute inset-0 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center">
            <SparklesIcon className="w-10 h-10 text-indigo-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
