export type Verdict = 'On Theme' | 'Partial' | 'Off Theme' | 'Miss';

export type ArtReference = {
  name: string;
  plain_english: string;
};

export type LookAnalysis = {
  score: number;
  verdict: Verdict;
  verdict_line: string;
  brand: string;
  house_context?: string;
  creative_director?: string;
  artist?: string;
  pillars: {
    wearable_sculpture: number;
    technology_craft: number;
    cultural_commentary: number;
    material_innovation: number;
    body_as_medium: number;
  };
  look_description: string;
  plain_english: string;
  critique: string;
  art_references?: ArtReference[];
  standout_element: string;
  what_they_should_have_worn: string;
};

export type SearchImage = {
  url: string;
  thumbnail: string;
  title: string;
};
