export type MetYear = {
  year: number;
  theme: string;
  pillars: Record<string, string>; // key → display label
};

export const MET_YEARS: MetYear[] = [
  {
    year: 2026, theme: 'Fashion as Art',
    pillars: { wearable_sculpture: 'Wearable Sculpture', technology_craft: 'Technology & Craft', cultural_commentary: 'Cultural Commentary', material_innovation: 'Material Innovation', body_as_medium: 'Body as Medium' },
  },
  {
    year: 2025, theme: 'Superfine: Tailoring Black Style',
    pillars: { tailoring_mastery: 'Tailoring Mastery', black_dandyism: 'Black Dandyism', sartorial_elegance: 'Sartorial Elegance', cultural_reclamation: 'Cultural Reclamation', silhouette_precision: 'Silhouette Precision' },
  },
  {
    year: 2024, theme: 'The Garden of Time',
    pillars: { temporal_narrative: 'Temporal Narrative', floral_language: 'Floral Language', decay_beauty: 'Decay & Beauty', craft_detail: 'Craft & Detail', romantic_vision: 'Romantic Vision' },
  },
  {
    year: 2023, theme: 'Karl Lagerfeld: A Line of Beauty',
    pillars: { lagerfeld_references: 'Lagerfeld References', graphic_line: 'Graphic Line', monochrome_mastery: 'Monochrome Mastery', chanel_codes: 'Chanel / Fendi Codes', modern_classicism: 'Modern Classicism' },
  },
  {
    year: 2022, theme: 'In America: An Anthology of Fashion',
    pillars: { american_identity: 'American Identity', historical_reference: 'Historical Reference', craft_narrative: 'Craft & Narrative', cultural_tension: 'Cultural Tension', innovation_tradition: 'Innovation vs. Tradition' },
  },
  {
    year: 2021, theme: 'In America: A Lexicon of Fashion',
    pillars: { american_vernacular: 'American Vernacular', emotional_resonance: 'Emotional Resonance', inclusivity: 'Inclusivity', contemporary_craft: 'Contemporary Craft', cultural_storytelling: 'Cultural Storytelling' },
  },
  {
    year: 2019, theme: 'Camp: Notes on Fashion',
    pillars: { camp_sensibility: 'Camp Sensibility', irony_wit: 'Irony & Wit', theatrical_excess: 'Theatrical Excess', cultural_subversion: 'Cultural Subversion', maximalism: 'Maximalism' },
  },
  {
    year: 2018, theme: 'Heavenly Bodies: Fashion and the Catholic Imagination',
    pillars: { sacred_iconography: 'Sacred Iconography', religious_reverence: 'Religious Reverence', craftsmanship: 'Craftsmanship', historical_reference: 'Historical Reference', spiritual_vision: 'Spiritual Vision' },
  },
  {
    year: 2017, theme: 'Rei Kawakubo / Comme des Garçons: Art of the In-Between',
    pillars: { conceptual_deconstruction: 'Conceptual Deconstruction', body_distortion: 'Body Distortion', anti_fashion: 'Anti-Fashion', intellectual_depth: 'Intellectual Depth', avant_garde_execution: 'Avant-Garde Execution' },
  },
  {
    year: 2016, theme: 'Manus x Machina: Fashion in an Age of Technology',
    pillars: { technology_integration: 'Technology Integration', handcraft_vs_machine: 'Handcraft vs. Machine', innovation: 'Innovation', material_experimentation: 'Material Experimentation', silhouette_engineering: 'Silhouette Engineering' },
  },
  {
    year: 2015, theme: 'China: Through the Looking Glass',
    pillars: { chinoiserie_references: 'Chinoiserie References', cultural_dialogue: 'Cultural Dialogue', east_west_fusion: 'East-West Fusion', craft_heritage: 'Craft Heritage', visual_poetry: 'Visual Poetry' },
  },
  {
    year: 2014, theme: 'Charles James: Beyond Fashion',
    pillars: { sculptural_construction: 'Sculptural Construction', architectural_form: 'Architectural Form', couture_craft: 'Couture Craft', historical_homage: 'Historical Homage', elegance_engineering: 'Elegance & Engineering' },
  },
  {
    year: 2013, theme: 'PUNK: Chaos to Couture',
    pillars: { punk_spirit: 'Punk Spirit', subversive_codes: 'Subversive Codes', diy_aesthetic: 'DIY Aesthetic', chaos_control: 'Chaos vs. Control', cultural_provocation: 'Cultural Provocation' },
  },
  {
    year: 2012, theme: 'Schiaparelli and Prada: Impossible Conversations',
    pillars: { surrealist_vision: 'Surrealist Vision', intellectual_wit: 'Intellectual Wit', art_fashion_dialogue: 'Art-Fashion Dialogue', bold_imagination: 'Bold Imagination', conceptual_dressing: 'Conceptual Dressing' },
  },
  {
    year: 2011, theme: 'Alexander McQueen: Savage Beauty',
    pillars: { mcqueen_references: 'McQueen References', savage_romanticism: 'Savage Romanticism', dark_beauty: 'Dark Beauty', craft_mastery: 'Craft Mastery', emotional_power: 'Emotional Power' },
  },
  {
    year: 2010, theme: 'American Woman: Fashioning a National Identity',
    pillars: { american_identity: 'American Identity', feminist_power: 'Feminist Power', cultural_narrative: 'Cultural Narrative', modern_silhouette: 'Modern Silhouette', national_symbols: 'National Symbols' },
  },
];

export const MET_YEARS_MAP = Object.fromEntries(MET_YEARS.map(y => [y.year, y]));

export function getMetYear(year: number): MetYear {
  return MET_YEARS_MAP[year] ?? {
    year,
    theme: 'Unknown Theme',
    pillars: { theme_adherence: 'Theme Adherence', creativity: 'Creativity', execution: 'Execution', cultural_awareness: 'Cultural Awareness', overall_impact: 'Overall Impact' },
  };
}
