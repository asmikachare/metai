import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const archiveCache = new Map<number, unknown>();

const STOCK_DOMAINS = ['gettyimages', 'shutterstock', 'alamy', 'istockphoto', 'apimages', 'depositphotos'];
function deprioritizeStock<T extends { url: string; thumbnail: string; title: string }>(imgs: T[]): T[] {
  const isStock = (img: T) => {
    const t = `${img.url} ${img.thumbnail} ${img.title}`.toLowerCase();
    return STOCK_DOMAINS.some(d => t.includes(d));
  };
  return [...imgs.filter(img => !isStock(img)), ...imgs.filter(img => isStock(img))];
}

type PillarDef = { label: string; weight: number };

// Per-year pillar definitions. Weights sum to 1.0 and reflect each theme's hierarchy.
const YEAR_PILLARS: Record<number, Record<string, PillarDef>> = {
  2026: {
    wearable_sculpture:  { label: 'Wearable Sculpture',   weight: 0.30 },
    material_innovation: { label: 'Material Innovation',   weight: 0.25 },
    body_as_medium:      { label: 'Body as Medium',        weight: 0.20 },
    technology_craft:    { label: 'Technology & Craft',    weight: 0.15 },
    cultural_commentary: { label: 'Cultural Commentary',   weight: 0.10 },
  },
  2025: {
    black_dandyism:      { label: 'Black Dandyism',        weight: 0.30 },
    tailoring_mastery:   { label: 'Tailoring Mastery',     weight: 0.28 },
    cultural_reclamation:{ label: 'Cultural Reclamation',  weight: 0.20 },
    silhouette_precision:{ label: 'Silhouette Precision',  weight: 0.14 },
    sartorial_elegance:  { label: 'Sartorial Elegance',    weight: 0.08 },
  },
  2024: {
    temporal_narrative:  { label: 'Temporal Narrative',    weight: 0.30 },
    decay_beauty:        { label: 'Decay & Beauty',        weight: 0.25 },
    floral_language:     { label: 'Floral Language',       weight: 0.20 },
    craft_detail:        { label: 'Craft & Detail',        weight: 0.15 },
    romantic_vision:     { label: 'Romantic Vision',       weight: 0.10 },
  },
  2023: {
    lagerfeld_references:{ label: 'Lagerfeld References',  weight: 0.30 },
    chanel_codes:        { label: 'Chanel / Fendi Codes',  weight: 0.25 },
    graphic_line:        { label: 'Graphic Line',          weight: 0.20 },
    monochrome_mastery:  { label: 'Monochrome Mastery',    weight: 0.15 },
    modern_classicism:   { label: 'Modern Classicism',     weight: 0.10 },
  },
  2022: {
    american_identity:   { label: 'American Identity',     weight: 0.30 },
    historical_reference:{ label: 'Historical Reference',  weight: 0.25 },
    craft_narrative:     { label: 'Craft & Narrative',     weight: 0.20 },
    cultural_tension:    { label: 'Cultural Tension',      weight: 0.15 },
    innovation_tradition:{ label: 'Innovation vs. Tradition', weight: 0.10 },
  },
  2021: {
    american_vernacular: { label: 'American Vernacular',   weight: 0.28 },
    cultural_storytelling:{ label: 'Cultural Storytelling',weight: 0.25 },
    emotional_resonance: { label: 'Emotional Resonance',   weight: 0.20 },
    contemporary_craft:  { label: 'Contemporary Craft',    weight: 0.17 },
    inclusivity:         { label: 'Inclusivity',           weight: 0.10 },
  },
  2019: {
    camp_sensibility:    { label: 'Camp Sensibility',      weight: 0.32 },
    theatrical_excess:   { label: 'Theatrical Excess',     weight: 0.25 },
    irony_wit:           { label: 'Irony & Wit',           weight: 0.20 },
    cultural_subversion: { label: 'Cultural Subversion',   weight: 0.15 },
    maximalism:          { label: 'Maximalism',            weight: 0.08 },
  },
  2018: {
    sacred_iconography:  { label: 'Sacred Iconography',    weight: 0.30 },
    spiritual_vision:    { label: 'Spiritual Vision',      weight: 0.25 },
    religious_reverence: { label: 'Religious Reverence',   weight: 0.20 },
    craftsmanship:       { label: 'Craftsmanship',         weight: 0.15 },
    historical_reference:{ label: 'Historical Reference',  weight: 0.10 },
  },
  2017: {
    conceptual_deconstruction: { label: 'Conceptual Deconstruction', weight: 0.30 },
    avant_garde_execution:     { label: 'Avant-Garde Execution',     weight: 0.25 },
    intellectual_depth:        { label: 'Intellectual Depth',        weight: 0.20 },
    body_distortion:           { label: 'Body Distortion',           weight: 0.15 },
    anti_fashion:              { label: 'Anti-Fashion',              weight: 0.10 },
  },
  2016: {
    technology_integration:   { label: 'Technology Integration',    weight: 0.30 },
    innovation:               { label: 'Innovation',                weight: 0.25 },
    handcraft_vs_machine:     { label: 'Handcraft vs. Machine',     weight: 0.22 },
    material_experimentation: { label: 'Material Experimentation',  weight: 0.15 },
    silhouette_engineering:   { label: 'Silhouette Engineering',    weight: 0.08 },
  },
  2015: {
    east_west_fusion:        { label: 'East-West Fusion',           weight: 0.30 },
    chinoiserie_references:  { label: 'Chinoiserie References',     weight: 0.25 },
    cultural_dialogue:       { label: 'Cultural Dialogue',          weight: 0.20 },
    craft_heritage:          { label: 'Craft Heritage',             weight: 0.15 },
    visual_poetry:           { label: 'Visual Poetry',              weight: 0.10 },
  },
  2014: {
    sculptural_construction: { label: 'Sculptural Construction',    weight: 0.30 },
    architectural_form:      { label: 'Architectural Form',         weight: 0.25 },
    elegance_engineering:    { label: 'Elegance & Engineering',     weight: 0.20 },
    couture_craft:           { label: 'Couture Craft',              weight: 0.15 },
    historical_homage:       { label: 'Historical Homage',          weight: 0.10 },
  },
  2013: {
    punk_spirit:             { label: 'Punk Spirit',                weight: 0.30 },
    cultural_provocation:    { label: 'Cultural Provocation',       weight: 0.25 },
    subversive_codes:        { label: 'Subversive Codes',           weight: 0.22 },
    chaos_control:           { label: 'Chaos vs. Control',          weight: 0.15 },
    diy_aesthetic:           { label: 'DIY Aesthetic',              weight: 0.08 },
  },
  2012: {
    art_fashion_dialogue:    { label: 'Art-Fashion Dialogue',       weight: 0.28 },
    surrealist_vision:       { label: 'Surrealist Vision',          weight: 0.25 },
    conceptual_dressing:     { label: 'Conceptual Dressing',        weight: 0.22 },
    intellectual_wit:        { label: 'Intellectual Wit',           weight: 0.15 },
    bold_imagination:        { label: 'Bold Imagination',           weight: 0.10 },
  },
  2011: {
    mcqueen_references:      { label: 'McQueen References',         weight: 0.30 },
    savage_romanticism:      { label: 'Savage Romanticism',         weight: 0.28 },
    emotional_power:         { label: 'Emotional Power',            weight: 0.20 },
    craft_mastery:           { label: 'Craft Mastery',              weight: 0.14 },
    dark_beauty:             { label: 'Dark Beauty',                weight: 0.08 },
  },
  2010: {
    american_identity:       { label: 'American Identity',          weight: 0.30 },
    cultural_narrative:      { label: 'Cultural Narrative',         weight: 0.25 },
    feminist_power:          { label: 'Feminist Power',             weight: 0.22 },
    national_symbols:        { label: 'National Symbols',           weight: 0.13 },
    modern_silhouette:       { label: 'Modern Silhouette',          weight: 0.10 },
  },
};

const YEAR_THEMES: Record<number, string> = {
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

function getDefaultPillars(year: number): Record<string, PillarDef> {
  return YEAR_PILLARS[year] ?? {
    theme_adherence: { label: 'Theme Adherence', weight: 0.20 },
    creativity:      { label: 'Creativity',      weight: 0.20 },
    execution:       { label: 'Execution',        weight: 0.20 },
    cultural_awareness: { label: 'Cultural Awareness', weight: 0.20 },
    overall_impact:  { label: 'Overall Impact',   weight: 0.20 },
  };
}

function getPillarLabels(year: number): Record<string, string> {
  return Object.fromEntries(
    Object.entries(getDefaultPillars(year)).map(([k, v]) => [k, v.label])
  );
}

function computeScore(pillarScores: Record<string, number>, pillars: Record<string, PillarDef>): number {
  const total = Object.entries(pillars).reduce(
    (sum, [key, { weight }]) => sum + (pillarScores[key] ?? 0) * weight, 0
  );
  return Math.round(total * 10) / 10;
}

function computeVerdict(score: number): string {
  if (score >= 8) return 'On Theme';
  if (score >= 6) return 'Partial';
  if (score >= 4) return 'Off Theme';
  return 'Miss';
}

function buildSystemPrompt(year: number, theme: string): string {
  const pillars = getDefaultPillars(year);
  const pillarList = Object.entries(pillars).map(([k, { label }]) => `${k} (${label})`).join(', ');

  return `You are a Met Gala fashion critic and stylist. Analyze the look against the ${year} Met Gala theme "${theme}".

Score it against these 5 pillars specific to this theme: ${pillarList}.

If factual context about the celebrity and designer is provided, use it — do not guess or contradict it. Your job is visual analysis, not fact recall.

Return ONLY a JSON object with these exact keys:
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

app.post('/api/search-look', async (req, res) => {
  const { name, year } = req.body as { name: string; year?: number };
  if (!name?.trim()) return res.status(400).json({ error: 'name required' });

  const metYear = year ?? 2026;
  const theme = YEAR_THEMES[metYear] ?? `${metYear} Met Gala`;
  const trimmedName = name.trim();
  const serperHeaders = { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' };

  try {
    // Step 1: Run attendance search + image search in parallel (faster)
    const [verifyRes, imageResRaw] = await Promise.all([
      fetch('https://google.serper.dev/search', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${trimmedName} ${metYear} Met Gala attended red carpet`, num: 8 }),
      }).then(r => r.json()).catch(() => null),

      fetch('https://google.serper.dev/images', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${trimmedName} ${metYear} Met Gala ${theme} red carpet`, num: 10 }),
      }).then(r => r.json()).catch(() => null),
    ]);

    const snippets = [
      verifyRes?.answerBox?.answer ?? '',
      verifyRes?.answerBox?.snippet ?? '',
      ...((verifyRes?.organic ?? []) as any[]).slice(0, 6).map((r: any) => `${r.title ?? ''}: ${r.snippet ?? ''}`),
    ].filter(Boolean).join('\n').slice(0, 1200);

    const allImages = ((imageResRaw?.images ?? []) as any[])
      .slice(0, 10)
      .map((item: any) => ({ url: item.imageUrl ?? '', thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '', title: item.title ?? '' }))
      .filter((img: any) => img.url);

    // Step 2: Claude verifies attendance — strict about the specific year
    const verifyMsg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 80,
      system: 'You are a strict fact-checker. Return only valid JSON, no explanation.',
      messages: [{ role: 'user', content: `Did "${trimmedName}" attend the ${metYear} Met Gala specifically?

RULES:
- Only return attended: true if a snippet explicitly mentions both "${trimmedName}" AND the year ${metYear} in the context of the Met Gala.
- Attending in other years does NOT count.
- If snippets only mention other years, return attended: false.
- If no snippet clearly confirms ${metYear}, return attended: false with confidence: low.

Snippets:
${snippets || 'No results found.'}

Return JSON only: { "attended": boolean, "confidence": "high" | "medium" | "low" }` }],
    });

    const vText = verifyMsg.content[0].type === 'text' ? verifyMsg.content[0].text : '';
    const vMatch = vText.match(/\{[\s\S]*?\}/);
    const verification = vMatch ? JSON.parse(vMatch[0]) : { attended: false, confidence: 'low' };

    // Step 3: Not attended — find suggested years via Claude
    if (!verification.attended || verification.confidence === 'low') {
      const yearsRes = await fetch('https://google.serper.dev/search', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${trimmedName} Met Gala years attended red carpet history`, num: 8 }),
      }).then(r => r.json()).catch(() => null);

      const yearsSnippets = [
        yearsRes?.answerBox?.answer ?? '',
        yearsRes?.answerBox?.snippet ?? '',
        ...((yearsRes?.organic ?? []) as any[]).slice(0, 6).map((r: any) => `${r.title ?? ''}: ${r.snippet ?? ''}`),
      ].filter(Boolean).join('\n').slice(0, 1000);

      const yearsMsg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        system: 'You are a factual assistant. Return only valid JSON, no explanation.',
        messages: [{ role: 'user', content: `What years did "${trimmedName}" attend the Met Gala? Only include years you can confirm from the snippets.

Snippets:
${yearsSnippets || 'No results found.'}

Return JSON only: { "years": [array of year numbers] }` }],
      });

      const yText = yearsMsg.content[0].type === 'text' ? yearsMsg.content[0].text : '';
      const yMatch = yText.match(/\{[\s\S]*?\}/);
      const yData = yMatch ? JSON.parse(yMatch[0]) : { years: [] };
      const suggestedYears = ((yData.years ?? []) as number[])
        .filter(y => y !== metYear)
        .sort((a, b) => b - a)
        .slice(0, 6);

      return res.json({ attended: false, images: [], suggestedYears, message: `${trimmedName} didn't attend the ${metYear} Met Gala.` });
    }

    // Step 4: Attended — Claude filters image titles to keep only year-matching ones
    const titlesText = allImages.map((img, i) => `${i + 1}. ${img.title || '(no title)'}`).join('\n');

    const filterMsg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 120,
      system: 'You are a strict image filter. Return only valid JSON, no explanation.',
      messages: [{ role: 'user', content: `These are image titles from a search for "${trimmedName}" at the ${metYear} Met Gala (theme: "${theme}").

${titlesText}

Which image numbers show BOTH: (1) the correct person "${trimmedName}" and (2) the ${metYear} Met Gala specifically?

- "confirmed": clearly shows ${trimmedName} at the ${metYear} Met Gala
- "uncertain": appears to show ${trimmedName} but year is unclear from the title — still likely the right person
- Exclude entirely: different person, different event, clearly different year

If fewer than 3 are confirmed, pad with uncertain ones. Never include images of a different person in uncertain.

Return JSON only: { "confirmed": [1-based indices], "uncertain": [1-based indices] }` }],
    });

    const fText = filterMsg.content[0].type === 'text' ? filterMsg.content[0].text : '';
    const fMatch = fText.match(/\{[\s\S]*?\}/);
    const fData = fMatch ? JSON.parse(fMatch[0]) : { confirmed: [], uncertain: [] };

    const confirmedSet = new Set(((fData.confirmed ?? []) as number[]).map(i => i - 1));
    const uncertainSet = new Set(((fData.uncertain ?? []) as number[]).map(i => i - 1));

    let filtered = allImages.filter((_, i) => confirmedSet.has(i));
    if (filtered.length < 3) {
      const extras = allImages.filter((_, i) => uncertainSet.has(i));
      filtered = [...filtered, ...extras];
    }
    // If Claude filter was too aggressive, fall back to all images
    const images = deprioritizeStock(filtered.length >= 3 ? filtered : allImages).slice(0, 5);

    res.json({ attended: true, images, topImage: images[0]?.url ?? null, suggestedYears: [] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? 'Search failed' });
  }
});

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

app.post('/api/analyze', async (req, res) => {
  const { imageUrl, imageBase64, mediaType, celebrityName, candidateUrls, year } = req.body as {
    imageUrl?: string; imageBase64?: string; mediaType?: string;
    celebrityName?: string; candidateUrls?: string[]; year?: number;
  };

  const metYear = year ?? 2026;
  const theme = YEAR_THEMES[metYear] ?? `${metYear} Met Gala`;

  let base64: string;
  let resolvedType: string;

  try {
    if (imageBase64) {
      base64 = imageBase64;
      resolvedType = mediaType ?? 'image/jpeg';
    } else {
      const urlsToTry = [
        ...(imageUrl ? [imageUrl] : []),
        ...(candidateUrls ?? []).filter(u => u !== imageUrl),
      ];
      if (!urlsToTry.length) return res.status(400).json({ error: 'Provide imageUrl or imageBase64' });

      let fetched = false;
      for (const url of urlsToTry) {
        try {
          const imgRes = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (!imgRes.ok) continue;
          const rawType = imgRes.headers.get('content-type')?.split(';')[0]?.toLowerCase() ?? '';
          if (!SUPPORTED_TYPES.includes(rawType)) continue;
          const buf = await imgRes.arrayBuffer();
          base64 = Buffer.from(buf).toString('base64');
          resolvedType = rawType;
          fetched = true;
          break;
        } catch { continue; }
      }
      if (!fetched) return res.status(400).json({ error: 'No fetchable image in a supported format. Try selecting a different photo or use the upload tab.' });
    }

    let factContext = '';
    if (celebrityName) {
      try {
        const webRes = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: `${celebrityName} ${metYear} Met Gala outfit designer brand`, num: 5 }),
        });
        const webData = await webRes.json() as any;
        const answerBox = webData.answerBox?.answer ?? webData.answerBox?.snippet ?? '';
        const snippets = (webData.organic ?? []).slice(0, 4).map((r: any) => r.snippet ?? '').filter(Boolean).join(' ');
        const raw = [answerBox, snippets].filter(Boolean).join(' ').slice(0, 800);
        if (raw) factContext = `\n\nFACTUAL CONTEXT (use this for brand/designer — do not contradict it):\n${raw}`;
      } catch { /* non-fatal */ }
    }

    const userText = [
      `Analyze this ${metYear} Met Gala look.`,
      celebrityName && `Celebrity: ${celebrityName}.`,
      factContext,
    ].filter(Boolean).join(' ');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: buildSystemPrompt(metYear, theme),
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: resolvedType as any, data: base64 } },
        { type: 'text', text: userText },
      ]}],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'No JSON in AI response' });

    const result = JSON.parse(match[0]);
    // Compute score and verdict deterministically from pillar scores + weights
    const yearPillars = getDefaultPillars(metYear);
    result.score = computeScore(result.pillars ?? {}, yearPillars);
    result.verdict = computeVerdict(result.score);
    // pillar_labels: labels only (no weights) — keeps frontend contract unchanged
    result.pillar_labels = getPillarLabels(metYear);
    result.met_year = metYear;
    result.met_theme = theme;

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? 'Analysis failed' });
  }
});

app.post('/api/archive-year', async (req, res) => {
  const { year } = req.body as { year: number };
  if (!year) return res.status(400).json({ error: 'year required' });

  if (archiveCache.has(year)) {
    console.log(`[cache hit] archive-year ${year}`);
    return res.json(archiveCache.get(year));
  }
  console.log(`[cache miss] archive-year ${year}`);

  const theme = YEAR_THEMES[year] ?? `${year} Met Gala`;

  const [imageResult, claudeResult] = await Promise.allSettled([
    fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${year} Met Gala best looks red carpet`, num: 6 }),
    }).then(r => r.json()),

    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: 'You are a sharp, opinionated fashion editor writing for a prestige fashion magazine. Be direct, witty, never hedge. Return only valid JSON — no markdown, no explanation.',
      messages: [{
        role: 'user',
        content: `Write about the ${year} Met Gala theme: "${theme}". Return JSON only with exactly these keys: blurb (2-3 sentence editorial paragraph about this year's theme and its cultural moment — opinionated, magazine voice, no hedging), must_knows (array of exactly 3 celebrity names who had the most talked-about looks that year — names only, no descriptions).`,
      }],
    }).then(msg => {
      const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    }),
  ]);

  const images = deprioritizeStock(
    imageResult.status === 'fulfilled'
      ? ((imageResult.value as any).images ?? []).slice(0, 6)
          .map((item: any) => ({ url: item.imageUrl ?? '', thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '', title: item.title ?? '' }))
          .filter((img: any) => img.url)
      : []
  );

  const editorial = claudeResult.status === 'fulfilled' ? claudeResult.value : null;

  const result = {
    images,
    blurb: editorial?.blurb ?? '',
    must_knows: editorial?.must_knows ?? [],
  };
  archiveCache.set(year, result);
  res.json(result);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`API server on :${PORT}`));
