export type PillarDef = { label: string; weight: number };

export type MetYear = {
  year: number;
  theme: string;
  pillars: Record<string, PillarDef>;
};

export const MET_YEARS: MetYear[] = [
  {
    year: 2026, theme: 'Fashion as Art',
    pillars: {
      wearable_sculpture:  { label: 'Wearable Sculpture',   weight: 0.30 },
      material_innovation: { label: 'Material Innovation',   weight: 0.25 },
      body_as_medium:      { label: 'Body as Medium',        weight: 0.20 },
      technology_craft:    { label: 'Technology & Craft',    weight: 0.15 },
      cultural_commentary: { label: 'Cultural Commentary',   weight: 0.10 },
    },
  },
  {
    year: 2025, theme: 'Superfine: Tailoring Black Style',
    pillars: {
      black_dandyism:       { label: 'Black Dandyism',       weight: 0.30 },
      tailoring_mastery:    { label: 'Tailoring Mastery',    weight: 0.28 },
      cultural_reclamation: { label: 'Cultural Reclamation', weight: 0.20 },
      silhouette_precision: { label: 'Silhouette Precision', weight: 0.14 },
      sartorial_elegance:   { label: 'Sartorial Elegance',   weight: 0.08 },
    },
  },
  {
    year: 2024, theme: 'The Garden of Time',
    pillars: {
      temporal_narrative: { label: 'Temporal Narrative', weight: 0.30 },
      decay_beauty:       { label: 'Decay & Beauty',     weight: 0.25 },
      floral_language:    { label: 'Floral Language',    weight: 0.20 },
      craft_detail:       { label: 'Craft & Detail',     weight: 0.15 },
      romantic_vision:    { label: 'Romantic Vision',    weight: 0.10 },
    },
  },
  {
    year: 2023, theme: 'Karl Lagerfeld: A Line of Beauty',
    pillars: {
      lagerfeld_references: { label: 'Lagerfeld References', weight: 0.30 },
      chanel_codes:         { label: 'Chanel / Fendi Codes', weight: 0.25 },
      graphic_line:         { label: 'Graphic Line',         weight: 0.20 },
      monochrome_mastery:   { label: 'Monochrome Mastery',   weight: 0.15 },
      modern_classicism:    { label: 'Modern Classicism',    weight: 0.10 },
    },
  },
  {
    year: 2022, theme: 'In America: An Anthology of Fashion',
    pillars: {
      american_identity:    { label: 'American Identity',        weight: 0.30 },
      historical_reference: { label: 'Historical Reference',     weight: 0.25 },
      craft_narrative:      { label: 'Craft & Narrative',        weight: 0.20 },
      cultural_tension:     { label: 'Cultural Tension',         weight: 0.15 },
      innovation_tradition: { label: 'Innovation vs. Tradition', weight: 0.10 },
    },
  },
  {
    year: 2021, theme: 'In America: A Lexicon of Fashion',
    pillars: {
      american_vernacular:   { label: 'American Vernacular',    weight: 0.28 },
      cultural_storytelling: { label: 'Cultural Storytelling',  weight: 0.25 },
      emotional_resonance:   { label: 'Emotional Resonance',    weight: 0.20 },
      contemporary_craft:    { label: 'Contemporary Craft',     weight: 0.17 },
      inclusivity:           { label: 'Inclusivity',            weight: 0.10 },
    },
  },
  {
    year: 2019, theme: 'Camp: Notes on Fashion',
    pillars: {
      camp_sensibility:   { label: 'Camp Sensibility',    weight: 0.32 },
      theatrical_excess:  { label: 'Theatrical Excess',   weight: 0.25 },
      irony_wit:          { label: 'Irony & Wit',         weight: 0.20 },
      cultural_subversion:{ label: 'Cultural Subversion', weight: 0.15 },
      maximalism:         { label: 'Maximalism',          weight: 0.08 },
    },
  },
  {
    year: 2018, theme: 'Heavenly Bodies: Fashion and the Catholic Imagination',
    pillars: {
      sacred_iconography:  { label: 'Sacred Iconography',  weight: 0.30 },
      spiritual_vision:    { label: 'Spiritual Vision',    weight: 0.25 },
      religious_reverence: { label: 'Religious Reverence', weight: 0.20 },
      craftsmanship:       { label: 'Craftsmanship',       weight: 0.15 },
      historical_reference:{ label: 'Historical Reference',weight: 0.10 },
    },
  },
  {
    year: 2017, theme: 'Rei Kawakubo / Comme des Garçons: Art of the In-Between',
    pillars: {
      conceptual_deconstruction: { label: 'Conceptual Deconstruction', weight: 0.30 },
      avant_garde_execution:     { label: 'Avant-Garde Execution',     weight: 0.25 },
      intellectual_depth:        { label: 'Intellectual Depth',        weight: 0.20 },
      body_distortion:           { label: 'Body Distortion',           weight: 0.15 },
      anti_fashion:              { label: 'Anti-Fashion',              weight: 0.10 },
    },
  },
  {
    year: 2016, theme: 'Manus x Machina: Fashion in an Age of Technology',
    pillars: {
      technology_integration:   { label: 'Technology Integration',   weight: 0.30 },
      innovation:               { label: 'Innovation',               weight: 0.25 },
      handcraft_vs_machine:     { label: 'Handcraft vs. Machine',    weight: 0.22 },
      material_experimentation: { label: 'Material Experimentation', weight: 0.15 },
      silhouette_engineering:   { label: 'Silhouette Engineering',   weight: 0.08 },
    },
  },
  {
    year: 2015, theme: 'China: Through the Looking Glass',
    pillars: {
      east_west_fusion:       { label: 'East-West Fusion',       weight: 0.30 },
      chinoiserie_references: { label: 'Chinoiserie References', weight: 0.25 },
      cultural_dialogue:      { label: 'Cultural Dialogue',      weight: 0.20 },
      craft_heritage:         { label: 'Craft Heritage',         weight: 0.15 },
      visual_poetry:          { label: 'Visual Poetry',          weight: 0.10 },
    },
  },
  {
    year: 2014, theme: 'Charles James: Beyond Fashion',
    pillars: {
      sculptural_construction: { label: 'Sculptural Construction', weight: 0.30 },
      architectural_form:      { label: 'Architectural Form',      weight: 0.25 },
      elegance_engineering:    { label: 'Elegance & Engineering',  weight: 0.20 },
      couture_craft:           { label: 'Couture Craft',           weight: 0.15 },
      historical_homage:       { label: 'Historical Homage',       weight: 0.10 },
    },
  },
  {
    year: 2013, theme: 'PUNK: Chaos to Couture',
    pillars: {
      punk_spirit:          { label: 'Punk Spirit',          weight: 0.30 },
      cultural_provocation: { label: 'Cultural Provocation', weight: 0.25 },
      subversive_codes:     { label: 'Subversive Codes',     weight: 0.22 },
      chaos_control:        { label: 'Chaos vs. Control',    weight: 0.15 },
      diy_aesthetic:        { label: 'DIY Aesthetic',        weight: 0.08 },
    },
  },
  {
    year: 2012, theme: 'Schiaparelli and Prada: Impossible Conversations',
    pillars: {
      art_fashion_dialogue: { label: 'Art-Fashion Dialogue', weight: 0.28 },
      surrealist_vision:    { label: 'Surrealist Vision',    weight: 0.25 },
      conceptual_dressing:  { label: 'Conceptual Dressing',  weight: 0.22 },
      intellectual_wit:     { label: 'Intellectual Wit',     weight: 0.15 },
      bold_imagination:     { label: 'Bold Imagination',     weight: 0.10 },
    },
  },
  {
    year: 2011, theme: 'Alexander McQueen: Savage Beauty',
    pillars: {
      mcqueen_references:  { label: 'McQueen References',  weight: 0.30 },
      savage_romanticism:  { label: 'Savage Romanticism',  weight: 0.28 },
      emotional_power:     { label: 'Emotional Power',     weight: 0.20 },
      craft_mastery:       { label: 'Craft Mastery',       weight: 0.14 },
      dark_beauty:         { label: 'Dark Beauty',         weight: 0.08 },
    },
  },
  {
    year: 2010, theme: 'American Woman: Fashioning a National Identity',
    pillars: {
      american_identity:  { label: 'American Identity',  weight: 0.30 },
      cultural_narrative: { label: 'Cultural Narrative', weight: 0.25 },
      feminist_power:     { label: 'Feminist Power',     weight: 0.22 },
      national_symbols:   { label: 'National Symbols',   weight: 0.13 },
      modern_silhouette:  { label: 'Modern Silhouette',  weight: 0.10 },
    },
  },
];

export const MET_YEARS_MAP = Object.fromEntries(MET_YEARS.map(y => [y.year, y]));

export function getMetYear(year: number): MetYear {
  return MET_YEARS_MAP[year] ?? {
    year,
    theme: 'Unknown Theme',
    pillars: {
      theme_adherence:    { label: 'Theme Adherence',    weight: 0.20 },
      creativity:         { label: 'Creativity',         weight: 0.20 },
      execution:          { label: 'Execution',          weight: 0.20 },
      cultural_awareness: { label: 'Cultural Awareness', weight: 0.20 },
      overall_impact:     { label: 'Overall Impact',     weight: 0.20 },
    },
  };
}
