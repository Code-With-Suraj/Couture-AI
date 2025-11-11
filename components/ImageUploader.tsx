
import React, { useState, useRef, useCallback } from 'react';
import { PhotoIcon, ArrowUpTrayIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert('Please upload a valid image file.');
      }
    }
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files);
  }, [handleFile]);
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
      <div className="flex justify-center items-center mb-4">
        <PhotoIcon className="w-16 h-16 text-indigo-500"/>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Find Your Perfect Outfit</h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">Upload a full-body photo, and our AI stylist will suggest outfits tailored just for you.</p>

      <form className="w-full" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        <label
          htmlFor="file-upload"
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ArrowUpTrayIcon className={`w-10 h-10 mb-3 transition-colors ${dragActive ? 'text-indigo-600' : 'text-slate-500'}`} />
            <p className="mb-2 text-sm text-slate-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, or WEBP</p>
          </div>
        </label>
      </form>
    </div>
  );
};

export default ImageUploader;
