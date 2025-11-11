import React, { useState } from 'react';
import ImageModal from './ImageModal';
import { ArrowDownTrayIcon } from './icons';

interface GeneratedImageViewerProps {
  images: string[];
  outfitType: string;
}

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ images, outfitType }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (imageSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    const mimeTypeMatch = imageSrc.match(/data:image\/(\w+);/);
    const extension = mimeTypeMatch ? mimeTypeMatch[1] : 'png';
    link.download = `couture-ai-${outfitType.toLowerCase().replace(' ', '-')}-${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
        <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
          Virtual Try-On Results: <span className="text-indigo-600">{outfitType}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative rounded-lg overflow-hidden shadow-md border border-slate-200 cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <img 
                src={image} 
                alt={`Generated outfit ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
               <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal from opening
                    handleDownload(image, index);
                  }}
                  className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75"
                  aria-label="Download image"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
};

export default GeneratedImageViewer;