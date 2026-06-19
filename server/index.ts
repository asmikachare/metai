import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Per-year pillar definitions (keys must match what we ask Claude to return)
const YEAR_PILLARS: Record<number, Record<string, string>> = {
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

function getDefaultPillars(year: number) {
  return YEAR_PILLARS[year] ?? {
    theme_adherence: 'Theme Adherence', creativity: 'Creativity',
    execution: 'Execution', cultural_awareness: 'Cultural Awareness', overall_impact: 'Overall Impact',
  };
}

function buildSystemPrompt(year: number, theme: string): string {
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

app.post('/api/search-look', async (req, res) => {
  const { name, year } = req.body as { name: string; year?: number };
  if (!name?.trim()) return res.status(400).json({ error: 'name required' });

  const metYear = year ?? 2026;
  const serperHeaders = { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' };

  try {
    // Run image search + attendance verification in parallel
    const [imageRes, verifyRes] = await Promise.all([
      fetch('https://google.serper.dev/images', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${name.trim()} ${metYear} Met Gala look outfit red carpet`, num: 5 }),
      }).then(r => r.json()).catch(() => null),

      fetch('https://google.serper.dev/search', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${name.trim()} ${metYear} Met Gala`, num: 5 }),
      }).then(r => r.json()).catch(() => null),
    ]);

    const images = ((imageRes?.images ?? []) as any[])
      .slice(0, 5)
      .map((item: any) => ({ url: item.imageUrl ?? '', thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '', title: item.title ?? '' }))
      .filter((img: any) => img.url);

    // Check if name + year appear together in text results
    const verifyText = ((verifyRes?.organic ?? []) as any[])
      .map((r: any) => `${r.title ?? ''} ${r.snippet ?? ''}`)
      .join(' ')
      .toLowerCase();
    const nameToken = name.trim().toLowerCase().split(' ')[0];
    const attended = verifyText.includes(nameToken) && verifyText.includes(String(metYear));

    // If not confirmed, find which years they did attend
    let suggestedYears: number[] = [];
    if (!attended || images.length === 0) {
      const yearsRes = await fetch('https://google.serper.dev/search', {
        method: 'POST', headers: serperHeaders,
        body: JSON.stringify({ q: `${name.trim()} Met Gala all years red carpet looks`, num: 8 }),
      }).then(r => r.json()).catch(() => null);

      const yearsText = ((yearsRes?.organic ?? []) as any[])
        .map((r: any) => `${r.title ?? ''} ${r.snippet ?? ''}`)
        .join(' ');

      suggestedYears = [...new Set(
        (yearsText.match(/\b(200[0-9]|201[0-9]|202[0-6])\b/g) ?? [])
          .map(Number)
          .filter((y: number) => y !== metYear)
      )].sort((a, b) => b - a).slice(0, 6) as number[];
    }

    res.json({ images, topImage: images[0]?.url ?? null, attended: attended || images.length > 0, suggestedYears });
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

    // Attach pillar labels so the frontend can display them without hardcoding
    const result = JSON.parse(match[0]);
    result.pillar_labels = getDefaultPillars(metYear);
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

  const images = imageResult.status === 'fulfilled'
    ? ((imageResult.value as any).images ?? []).slice(0, 6)
        .map((item: any) => ({ url: item.imageUrl ?? '', thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '', title: item.title ?? '' }))
        .filter((img: any) => img.url)
    : [];

  const editorial = claudeResult.status === 'fulfilled' ? claudeResult.value : null;

  res.json({
    images,
    blurb: editorial?.blurb ?? '',
    must_knows: editorial?.must_knows ?? [],
  });
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`API server on :${PORT}`));
