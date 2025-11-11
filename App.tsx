
import React, { useState, useCallback } from 'react';
import { getOutfitSuggestions, generateTryOnImages } from './services/geminiService';
import { OutfitSuggestion, OutfitVariation } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SuggestionCard from './components/SuggestionCard';
import GeneratedImageViewer from './components/GeneratedImageViewer';
import Loader from './components/Loader';
import { ArrowPathIcon, ExclamationTriangleIcon } from './components/icons';

type AppState = 'initial' | 'loadingSuggestions' | 'suggestionsReady' | 'loadingTryOn' | 'tryOnReady' | 'error';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initial');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<OutfitSuggestion | null>(null);
  const [activeOutfitDescription, setActiveOutfitDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setAppState('loadingSuggestions');
      setError(null);
      setSuggestions([]);
      setGeneratedImages([]);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        setUserImage(reader.result as string);

        const fetchedSuggestions = await getOutfitSuggestions(base64Image, file.type);
        if (fetchedSuggestions && fetchedSuggestions.length > 0) {
          setSuggestions(fetchedSuggestions);
          setAppState('suggestionsReady');
        } else {
          throw new Error("Could not generate outfit suggestions. The response was empty.");
        }
      };
      reader.onerror = () => {
        throw new Error("Failed to read the uploaded file.");
      };
    } catch (e: any) {
      console.error(e);
      setError(`Failed to get suggestions: ${e.message}. Please try a different image or prompt.`);
      setAppState('error');
    }
  }, []);

  const handleTryOn = useCallback(async (suggestion: OutfitSuggestion, outfit: OutfitVariation) => {
    if (!userImage) return;

    try {
      setAppState('loadingTryOn');
      setActiveSuggestion(suggestion);
      setActiveOutfitDescription(outfit.description);
      setError(null);
      setGeneratedImages([]);
      
      const base64Image = userImage.split(',')[1];
      const mimeType = userImage.split(';')[0].split(':')[1];
      
      const images = await generateTryOnImages(base64Image, mimeType, outfit.description);

      if (images && images.length > 0) {
        setGeneratedImages(images);
        setAppState('tryOnReady');
      } else {
        throw new Error("Could not generate try-on images. The AI returned no images.");
      }
    } catch (e: any) {
      console.error(e);
      setError(`Failed to generate try-on images: ${e.message}. Please try again.`);
      setAppState('error');
    }
  }, [userImage]);

  const handleReset = () => {
    setAppState('initial');
    setUserImage(null);
    setSuggestions([]);
    setGeneratedImages([]);
    setActiveSuggestion(null);
    setActiveOutfitDescription(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {appState === 'initial' && <ImageUploader onImageUpload={handleImageUpload} />}

        {(appState === 'loadingSuggestions' || appState === 'loadingTryOn') && (
            <div className="text-center w-full max-w-lg mx-auto">
                <Loader />
                <p className="mt-4 text-lg text-slate-600 font-medium">
                    {appState === 'loadingSuggestions' 
                        ? 'Our AI stylist is analyzing your look and curating outfits...' 
                        : `Virtually trying on the "${activeSuggestion?.type}" look...`}
                </p>
                <p className="mt-2 text-sm text-slate-500">This can take a moment, please wait.</p>
            </div>
        )}

        {error && (
            <div className="text-center bg-red-100 border border-red-300 text-red-800 rounded-lg p-6 w-full max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500"/>
                </div>
                <h3 className="text-xl font-bold mb-2">An Error Occurred</h3>
                <p className="text-md mb-6">{error}</p>
                <button onClick={handleReset} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto">
                    <ArrowPathIcon className="w-5 h-5 mr-2"/>
                    Try Again
                </button>
            </div>
        )}

        {(appState === 'suggestionsReady' || appState === 'loadingTryOn' || appState === 'tryOnReady' || (appState === 'error' && userImage)) && userImage && (
          <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 flex flex-col items-center">
                      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Your Photo</h2>
                      <img src={userImage} alt="User upload" className="rounded-2xl shadow-lg object-contain max-h-[500px] w-full" />
                      <button onClick={handleReset} className="mt-6 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                          <ArrowPathIcon className="w-5 h-5 mr-2"/>
                          Start Over
                      </button>
                  </div>

                  <div className="lg:col-span-2">
                      {suggestions.length > 0 && (
                          <>
                              <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center lg:text-left">Outfit Suggestions</h2>
                              <div className="space-y-6">
                                  {suggestions.map((suggestion) => (
                                      <SuggestionCard
                                          key={suggestion.type}
                                          suggestion={suggestion}
                                          onTryOn={handleTryOn}
                                          appState={appState}
                                          activeSuggestionType={activeSuggestion?.type}
                                          activeOutfitDescription={activeOutfitDescription}
                                      />
                                  ))}
                              </div>
                          </>
                      )}
                      
                      {appState === 'tryOnReady' && generatedImages.length > 0 && activeSuggestion && (
                        <GeneratedImageViewer images={generatedImages} outfitType={activeSuggestion.type} />
                      )}
                  </div>
              </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
