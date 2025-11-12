import React, { useState } from 'react';
import ImageModal from './ImageModal';
import { ArrowDownTrayIcon, HeartIcon, HeartIconSolid } from './icons';

interface GeneratedImageViewerProps {
  images: string[];
  outfitType: string;
  favorites: string[];
  onAddFavorite: (imageUrl: string) => void;
  onRemoveFavorite: (imageUrl: string) => void;
}

const GeneratedImageViewer: React.FC<GeneratedImageViewerProps> = ({ images, outfitType, favorites, onAddFavorite, onRemoveFavorite }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = (imageSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    const mimeTypeMatch = imageSrc.match(/data:image\/(\w+);/);
    const extension = mimeTypeMatch ? mimeTypeMatch[1] : 'png';
    link.download = `roopix-ai-${outfitType.toLowerCase().replace(' ', '-')}-${index + 1}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = -1 * ((y - height / 2) / (height / 2)) * 8; // Max 8 deg rotation
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    const imgElement = e.currentTarget.querySelector('img');
    if (imgElement) {
        imgElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const imgElement = e.currentTarget.querySelector('img');
    if (imgElement) {
        imgElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  return (
    <>
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
        <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
          Virtual Try-On Results: <span className="text-indigo-600">{outfitType}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image, index) => {
            const isFavorited = favorites.includes(image);
            return (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden shadow-md border border-slate-200 cursor-pointer group"
                onClick={() => setSelectedImage(image)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={image} 
                  alt={`Generated outfit ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFavorited) {
                        onRemoveFavorite(image);
                      } else {
                        onAddFavorite(image);
                      }
                    }}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorited ? <HeartIconSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image, index);
                    }}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                    aria-label="Download image"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedImage && (
        <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  );
};

export default GeneratedImageViewer;