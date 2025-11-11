import React, { useEffect } from 'react';
import { XMarkIcon } from './icons';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative bg-white p-2 rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="Enlarged view" className="object-contain max-w-full max-h-[calc(90vh-1rem)]" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-slate-800 hover:bg-slate-200 transition-colors"
          aria-label="Close image viewer"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;