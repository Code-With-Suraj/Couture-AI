
import React, { useState } from 'react';
import { OutfitSuggestion, OutfitVariation } from '../types';
import { SparklesIcon, TagIcon } from './icons';

interface SuggestionCardProps {
  suggestion: OutfitSuggestion;
  onTryOn: (suggestion: OutfitSuggestion, outfit: OutfitVariation) => void;
  appState: 'initial' | 'loadingSuggestions' | 'suggestionsReady' | 'loadingTryOn' | 'tryOnReady' | 'error';
  activeSuggestionType?: OutfitSuggestion['type'];
  activeOutfitDescription?: string | null;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onTryOn, appState, activeSuggestionType, activeOutfitDescription }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedOutfit = suggestion.outfits[selectedIndex];
  
  const isCardInactive = appState === 'loadingTryOn' && activeSuggestionType !== suggestion.type;

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Formal': return 'bg-blue-100 text-blue-800';
      case 'Casual': return 'bg-green-100 text-green-800';
      case 'Stylish': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-300 ${isCardInactive ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-800">{suggestion.type} Look</h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getBadgeColor(suggestion.type)}`}>
          {suggestion.type}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex border-b border-slate-200">
            {suggestion.outfits.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`flex-1 py-2 px-1 text-sm font-medium transition-colors ${selectedIndex === index ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Outfit {index + 1}
                </button>
            ))}
        </div>
      </div>

      <div className="animate-fade-in">
        <p className="text-slate-600 mb-5 min-h-[60px]">{selectedOutfit.description}</p>
        
        <div className="mb-6">
            <h4 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
              <TagIcon className="w-5 h-5 mr-2 text-slate-500" />
              Outfit Items
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              {selectedOutfit.items.map((item, index) => (
                  <li key={index}>{item}</li>
              ))}
            </ul>
        </div>
        
        <button 
          onClick={() => onTryOn(suggestion, selectedOutfit)}
          disabled={appState === 'loadingTryOn'}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {appState === 'loadingTryOn' && activeSuggestionType === suggestion.type && activeOutfitDescription === selectedOutfit.description ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Virtual Try-On
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
