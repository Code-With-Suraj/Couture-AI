
export interface OutfitVariation {
  description: string;
  items: string[];
}

export interface OutfitSuggestion {
  type: 'Formal' | 'Casual' | 'Stylish';
  outfits: OutfitVariation[];
}
