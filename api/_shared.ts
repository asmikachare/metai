import type { IncomingMessage, ServerResponse } from 'node:http';

export const YEAR_PILLARS: Record<number, Record<string, string>> = {
  2026: { wearable_sculpture: 'Wearable Sculpture', technology_craft: 'Technology & Craft', cultural_commentary: 'Cultural Commentary', material_innovation: 'Material Innovation', body_as_medium: 'Body as Medium' },
  2025: { tailoring_mastery: 'Tailoring Mastery', black_dandyism: 'Black Dandyism', sartorial_elegance: 'Sartorial Elegance', cultural_reclamation: 'Cultural Reclamation', silhouette_precision: 'Silhouette Precision' },
  2024: { temporal_narrative: 'Temporal Narrative', floral_language: 'Floral Language', decay_beauty: 'Decay & Beauty', craft_detail: 'Craft & Detail', romantic_vision: 'Romantic Vision' },
  2023: { lagerfeld_references: 'Lagerfeld References', graphic_line: 'Graphic Line', monochrome_mastery: 'Monochrome Mastery', chanel_codes: 'Chanel / Fendi Codes', modern_classicism: 'Modern Classicism' },
  2022: { american_identity: 'American Identity', historical_reference: 'Historical Reference', craft_narrative: 'Craft & Narrative', cultural_tension: 'Cultural Tension', innovation_tradition: 'Innovation vs. Tradition' },
  2021: { american_vernacular: 'American Vernacular', emotional_resonance: 'Emotional Resonance', inclusivity: 'Inclusivity', contemporary_craft: 'Contemporary Craft', cultural_storytelling: 'Cultural Storytelling' },
  2019: { camp_sensibility: 'Camp Sensibility', irony_wit: 'Irony & Wit', theatrical_excess: 'Theatrical Excess', cultural_subversion: 'Cultural Subversion', maximalism: 'Maximalism' },
  2018: { sacred_iconography: 'Sacred Iconography', religious_reverence: 'Religious Reverence', craftsmanship: 'Craftsmanship', historical_reference: 'Historical Reference', spiritual_vision: 'Spiritual Vision' },
  2017: { conceptual_deconstruction: 'Conceptual Deconstruction', body_distortion: 'Body Distortion', anti_fashion: 'Anti-Fashion', intellectual_depth: 'Intellectual Depth', avant_garde_execution: 'Avant-Garde Execution' },
  2016: { technology_integration: 'Technology Integration', handcraft_vs_machine: 'Handcraft vs. Machine', innovation: 'Innovation', material_experimentation: 'Material Experimentation', silhouette_engineering: 'Silhouette Engineering' },
  2015: { chinoiserie_references: 'Chinoiserie References', cultural_dialogue: 'Cultural Dialogue', east_west_fusion: 'East-West Fusion', craft_heritage: 'Craft Heritage', visual_poetry: 'Visual Poetry' },
  2014: { sculptural_construction: 'Sculptural Construction', architectural_form: 'Architectural Form', couture_craft: 'Couture Craft', historical_homage: 'Historical Homage', elegance_engineering: 'Elegance & Engineering' },
  2013: { punk_spirit: 'Punk Spirit', subversive_codes: 'Subversive Codes', diy_aesthetic: 'DIY Aesthetic', chaos_control: 'Chaos vs. Control', cultural_provocation: 'Cultural Provocation' },
  2012: { surrealist_vision: 'Surrealist Vision', intellectual_wit: 'Intellectual Wit', art_fashion_dialogue: 'Art-Fashion Dialogue', bold_imagination: 'Bold Imagination', conceptual_dressing: 'Conceptual Dressing' },
  2011: { mcqueen_references: 'McQueen References', savage_romanticism: 'Savage Romanticism', dark_beauty: 'Dark Beauty', craft_mastery: 'Craft Mastery', emotional_power: 'Emotional Power' },
  2010: { american_identity: 'American Identity', feminist_power: 'Feminist Power', cultural_narrative: 'Cultural Narrative', modern_silhouette: 'Modern Silhouette', national_symbols: 'National Symbols' },
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

export function getDefaultPillars(year: number) {
  return YEAR_PILLARS[year] ?? {
    theme_adherence: 'Theme Adherence', creativity: 'Creativity',
    execution: 'Execution', cultural_awareness: 'Cultural Awareness', overall_impact: 'Overall Impact',
  };
}

export function buildSystemPrompt(year: number, theme: string): string {
  const pillars = getDefaultPillars(year);
  const pillarList = Object.entries(pillars).map(([k, v]) => `${k} (${v})`).join(', ');
  return `You are a Met Gala fashion critic and stylist. Analyze the look against the ${year} Met Gala theme "${theme}".

Score it against these 5 pillars specific to this theme: ${pillarList}.

If factual context about the celebrity and designer is provided, use it — do not guess or contradict it. Your job is visual analysis, not fact recall.

Return ONLY a JSON object with these exact keys:
- score (number 0-10)
- verdict (one of "On Theme" | "Partial" | "Off Theme" | "Miss")
- verdict_line (one punchy, magazine-cover sentence — opinionated, witty, no hedging)
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
