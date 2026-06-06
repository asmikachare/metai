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
  pillars: Record<string, number>;
  pillar_labels?: Record<string, string>;
  met_year?: number;
  met_theme?: string;
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
