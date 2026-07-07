import type { IncomingMessage, ServerResponse } from 'node:http';

export type PillarDef = { label: string; weight: number };

export const YEAR_PILLARS: Record<number, Record<string, PillarDef>> = {
  2026: {
    wearable_sculpture:  { label: 'Wearable Sculpture',   weight: 0.30 },
    material_innovation: { label: 'Material Innovation',   weight: 0.25 },
    body_as_medium:      { label: 'Body as Medium',        weight: 0.20 },
    technology_craft:    { label: 'Technology & Craft',    weight: 0.15 },
    cultural_commentary: { label: 'Cultural Commentary',   weight: 0.10 },
  },
  2025: {
    black_dandyism:       { label: 'Black Dandyism',       weight: 0.30 },
    tailoring_mastery:    { label: 'Tailoring Mastery',    weight: 0.28 },
    cultural_reclamation: { label: 'Cultural Reclamation', weight: 0.20 },
    silhouette_precision: { label: 'Silhouette Precision', weight: 0.14 },
    sartorial_elegance:   { label: 'Sartorial Elegance',   weight: 0.08 },
  },
  2024: {
    temporal_narrative: { label: 'Temporal Narrative', weight: 0.30 },
    decay_beauty:       { label: 'Decay & Beauty',     weight: 0.25 },
    floral_language:    { label: 'Floral Language',    weight: 0.20 },
    craft_detail:       { label: 'Craft & Detail',     weight: 0.15 },
    romantic_vision:    { label: 'Romantic Vision',    weight: 0.10 },
  },
  2023: {
    lagerfeld_references: { label: 'Lagerfeld References', weight: 0.30 },
    chanel_codes:         { label: 'Chanel / Fendi Codes', weight: 0.25 },
    graphic_line:         { label: 'Graphic Line',         weight: 0.20 },
    monochrome_mastery:   { label: 'Monochrome Mastery',   weight: 0.15 },
    modern_classicism:    { label: 'Modern Classicism',    weight: 0.10 },
  },
  2022: {
    american_identity:    { label: 'American Identity',        weight: 0.30 },
    historical_reference: { label: 'Historical Reference',     weight: 0.25 },
    craft_narrative:      { label: 'Craft & Narrative',        weight: 0.20 },
    cultural_tension:     { label: 'Cultural Tension',         weight: 0.15 },
    innovation_tradition: { label: 'Innovation vs. Tradition', weight: 0.10 },
  },
  2021: {
    american_vernacular:   { label: 'American Vernacular',   weight: 0.28 },
    cultural_storytelling: { label: 'Cultural Storytelling', weight: 0.25 },
    emotional_resonance:   { label: 'Emotional Resonance',   weight: 0.20 },
    contemporary_craft:    { label: 'Contemporary Craft',    weight: 0.17 },
    inclusivity:           { label: 'Inclusivity',           weight: 0.10 },
  },
  2019: {
    camp_sensibility:    { label: 'Camp Sensibility',    weight: 0.32 },
    theatrical_excess:   { label: 'Theatrical Excess',   weight: 0.25 },
    irony_wit:           { label: 'Irony & Wit',         weight: 0.20 },
    cultural_subversion: { label: 'Cultural Subversion', weight: 0.15 },
    maximalism:          { label: 'Maximalism',          weight: 0.08 },
  },
  2018: {
    sacred_iconography:  { label: 'Sacred Iconography',  weight: 0.30 },
    spiritual_vision:    { label: 'Spiritual Vision',    weight: 0.25 },
    religious_reverence: { label: 'Religious Reverence', weight: 0.20 },
    craftsmanship:       { label: 'Craftsmanship',       weight: 0.15 },
    historical_reference:{ label: 'Historical Reference',weight: 0.10 },
  },
  2017: {
    conceptual_deconstruction: { label: 'Conceptual Deconstruction', weight: 0.30 },
    avant_garde_execution:     { label: 'Avant-Garde Execution',     weight: 0.25 },
    intellectual_depth:        { label: 'Intellectual Depth',        weight: 0.20 },
    body_distortion:           { label: 'Body Distortion',           weight: 0.15 },
    anti_fashion:              { label: 'Anti-Fashion',              weight: 0.10 },
  },
  2016: {
    technology_integration:   { label: 'Technology Integration',   weight: 0.30 },
    innovation:               { label: 'Innovation',               weight: 0.25 },
    handcraft_vs_machine:     { label: 'Handcraft vs. Machine',    weight: 0.22 },
    material_experimentation: { label: 'Material Experimentation', weight: 0.15 },
    silhouette_engineering:   { label: 'Silhouette Engineering',   weight: 0.08 },
  },
  2015: {
    east_west_fusion:       { label: 'East-West Fusion',       weight: 0.30 },
    chinoiserie_references: { label: 'Chinoiserie References', weight: 0.25 },
    cultural_dialogue:      { label: 'Cultural Dialogue',      weight: 0.20 },
    craft_heritage:         { label: 'Craft Heritage',         weight: 0.15 },
    visual_poetry:          { label: 'Visual Poetry',          weight: 0.10 },
  },
  2014: {
    sculptural_construction: { label: 'Sculptural Construction', weight: 0.30 },
    architectural_form:      { label: 'Architectural Form',      weight: 0.25 },
    elegance_engineering:    { label: 'Elegance & Engineering',  weight: 0.20 },
    couture_craft:           { label: 'Couture Craft',           weight: 0.15 },
    historical_homage:       { label: 'Historical Homage',       weight: 0.10 },
  },
  2013: {
    punk_spirit:          { label: 'Punk Spirit',          weight: 0.30 },
    cultural_provocation: { label: 'Cultural Provocation', weight: 0.25 },
    subversive_codes:     { label: 'Subversive Codes',     weight: 0.22 },
    chaos_control:        { label: 'Chaos vs. Control',    weight: 0.15 },
    diy_aesthetic:        { label: 'DIY Aesthetic',        weight: 0.08 },
  },
  2012: {
    art_fashion_dialogue: { label: 'Art-Fashion Dialogue', weight: 0.28 },
    surrealist_vision:    { label: 'Surrealist Vision',    weight: 0.25 },
    conceptual_dressing:  { label: 'Conceptual Dressing',  weight: 0.22 },
    intellectual_wit:     { label: 'Intellectual Wit',     weight: 0.15 },
    bold_imagination:     { label: 'Bold Imagination',     weight: 0.10 },
  },
  2011: {
    mcqueen_references: { label: 'McQueen References', weight: 0.30 },
    savage_romanticism: { label: 'Savage Romanticism', weight: 0.28 },
    emotional_power:    { label: 'Emotional Power',    weight: 0.20 },
    craft_mastery:      { label: 'Craft Mastery',      weight: 0.14 },
    dark_beauty:        { label: 'Dark Beauty',        weight: 0.08 },
  },
  2010: {
    american_identity:  { label: 'American Identity',  weight: 0.30 },
    cultural_narrative: { label: 'Cultural Narrative', weight: 0.25 },
    feminist_power:     { label: 'Feminist Power',     weight: 0.22 },
    national_symbols:   { label: 'National Symbols',   weight: 0.13 },
    modern_silhouette:  { label: 'Modern Silhouette',  weight: 0.10 },
  },
};

export const YEAR_THEMES: Record<number, string> = {
  2026: 'Fashion as Art', 2025: 'Superfine: Tailoring Black Style', 2024: 'The Garden of Time',
  2023: 'Karl Lagerfeld: A Line of Beauty', 2022: 'In America: An Anthology of Fashion',
  2021: 'In America: A Lexicon of Fashion', 2019: 'Camp: Notes on Fashion',
  2018: 'Heavenly Bodies: Fashion and the Catholic Imagination',
  2017: 'Rei Kawakubo / Comme des Garçons: Art of the In-Between',
  2016: 'Manus x Machina: Fashion in an Age of Technology',
  2015: 'China: Through the Looking Glass', 2014: 'Charles James: Beyond Fashion',
  2013: 'PUNK: Chaos to Couture', 2012: 'Schiaparelli and Prada: Impossible Conversations',
  2011: 'Alexander McQueen: Savage Beauty', 2010: 'American Woman: Fashioning a National Identity',
};

export function getDefaultPillars(year: number): Record<string, PillarDef> {
  return YEAR_PILLARS[year] ?? {
    theme_adherence:    { label: 'Theme Adherence',    weight: 0.20 },
    creativity:         { label: 'Creativity',         weight: 0.20 },
    execution:          { label: 'Execution',          weight: 0.20 },
    cultural_awareness: { label: 'Cultural Awareness', weight: 0.20 },
    overall_impact:     { label: 'Overall Impact',     weight: 0.20 },
  };
}

export function getPillarLabels(year: number): Record<string, string> {
  return Object.fromEntries(
    Object.entries(getDefaultPillars(year)).map(([k, v]) => [k, v.label])
  );
}

export function computeScore(pillarScores: Record<string, number>, pillars: Record<string, PillarDef>): number {
  const total = Object.entries(pillars).reduce(
    (sum, [key, { weight }]) => sum + (pillarScores[key] ?? 0) * weight, 0
  );
  return Math.round(total * 10) / 10;
}

export function computeVerdict(score: number): string {
  if (score >= 8) return 'On Theme';
  if (score >= 6) return 'Partial';
  if (score >= 4) return 'Off Theme';
  return 'Miss';
}

export function buildSystemPrompt(year: number, theme: string): string {
  const pillars = getDefaultPillars(year);
  const pillarList = Object.entries(pillars).map(([k, { label }]) => `${k} (${label})`).join(', ');
  return `You are a Met Gala fashion critic and stylist. Analyze the look against the ${year} Met Gala theme "${theme}".

Score it against these 5 pillars specific to this theme: ${pillarList}.

If factual context about the celebrity and designer is provided, use it — do not guess or contradict it. Your job is visual analysis, not fact recall.

EDITORIAL STANDARDS — apply to every field:
- Critique the clothes, never the body. No commentary on weight, skin tone, age, body shape, or physical features.
- Cultural and religious dress is judged on craft and theme execution only. Never frame cultural garments as costume, gimmick, or inherently on/off-theme. Faith-mandated items (turbans, hijabs, crosses, etc.) are never scored negatively for existing — only how the total look engages the theme is fair game.
- No stereotypes or generalizations about any nationality, ethnicity, religion, or culture, including flattering ones. Judge the individual look.
- Stay politically neutral. If the look makes a political statement, describe what it is and how well it's executed sartorially — don't endorse or condemn the position.
- Wit targets craft choices, hubris, and theme misses — never identity.

Return ONLY a JSON object with these exact keys:
- verdict_line (one punchy, magazine-cover sentence — opinionated, witty, no hedging. The line must land on the same argument the critique makes, not contradict it. Do not reach for metaphors from colonialism, conquest, or cultural domination unless the critique is explicitly making that point about the look. When the look draws on cultural or religious dress, the wit belongs on the craft, the theatricality, or the theme tension — not on the culture itself.)
- brand (designer/house from the provided context, or "Unknown" if none given)
- house_context (1 sentence on who this designer/house is and what they are known for)
- creative_director (the creative director if known from context, omit key if unknown)
- artist (any collaborating artist, omit key if none)
- pillars (object with EXACTLY these keys: ${Object.keys(pillars).join(', ')} — each scored 0-10)
- look_description (1 sentence on what they wore)
- plain_english (2-3 sentences explaining the score in plain language — no jargon)
- critique (2-3 sentences of expert analysis with full fashion/art vocabulary)
- art_references (array of objects with "name" and "plain_english" keys)
- standout_element (1 sentence on the single most defining element, good or bad)
- what_they_should_have_worn (1-2 specific sentences referencing real pieces or direction that would have fit better)`;
}

const STOCK_DOMAINS = ['gettyimages', 'shutterstock', 'alamy', 'istockphoto', 'apimages', 'depositphotos'];
export function deprioritizeStock<T extends { url: string; thumbnail: string; title: string }>(imgs: T[]): T[] {
  const isStock = (img: T) => {
    const t = `${img.url} ${img.thumbnail} ${img.title}`.toLowerCase();
    return STOCK_DOMAINS.some(d => t.includes(d));
  };
  return [...imgs.filter(img => !isStock(img)), ...imgs.filter(img => isStock(img))];
}

export async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let s = '';
    req.on('data', c => s += c);
    req.on('end', () => { try { resolve(JSON.parse(s)); } catch { resolve({}); } });
  });
}

export function sendJson(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}
