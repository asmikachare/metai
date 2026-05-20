import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a Met Gala fashion critic and stylist. Analyze the look against the 2026 theme "Fashion as Art" (pillars: wearable sculpture, technology & craft, cultural commentary, material innovation, the body as medium).

If factual context about the celebrity and designer is provided, use it — do not guess or contradict it. Your job is visual analysis, not fact recall.

Return ONLY a JSON object with these exact keys:
- score (number 0-10)
- verdict (one of "On Theme" | "Partial" | "Off Theme" | "Miss")
- verdict_line (one punchy, magazine-cover sentence — opinionated, witty, no hedging)
- brand (designer/house from the provided context, or "Unknown" if none given)
- house_context (1 sentence on who this designer/house is and what they are known for — written for someone who loves fashion but is still learning, e.g. "Mugler is a French house known for futuristic, body-sculpting designs that treat the body as architecture")
- creative_director (the creative director if known from context, omit key if unknown)
- artist (any collaborating artist — painter, sculptor, etc. — omit key if none)
- pillars (object with keys: wearable_sculpture, technology_craft, cultural_commentary, material_innovation, body_as_medium — each scored 0-10)
- look_description (1 sentence on what they wore)
- plain_english (2-3 sentences explaining the score in plain language — no jargon, written for someone who loves fashion but doesn't know the archives. Explain WHY it works or doesn't in terms anyone can understand)
- critique (2-3 sentences of expert analysis with full fashion/art vocabulary)
- art_references (array of objects with "name" and "plain_english" keys — every art movement, artist, collection, or cultural reference mentioned anywhere in your response, with a 1-sentence plain English explanation of what it is. E.g. {"name": "De Stijl", "plain_english": "A 1920s Dutch art movement that used only primary colors and straight lines — think Mondrian's grid paintings"})
- standout_element (1 sentence on the single most defining element, good or bad)
- what_they_should_have_worn (1-2 specific sentences referencing real archive pieces or a design direction that would have fit better)`;

app.post('/api/search-look', async (req, res) => {
  const { name } = req.body as { name: string };
  if (!name?.trim()) return res.status(400).json({ error: 'name required' });

  const query = `${name.trim()} 2026 Met Gala look outfit red carpet`;

  try {
    const r = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: query, num: 5 }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error('Serper error:', r.status, body);
      return res.status(502).json({ error: 'Search API error' });
    }
    const data = await r.json() as any;
    const images = (data.images ?? [])
      .slice(0, 5)
      .map((item: any) => ({
        url: item.imageUrl ?? '',
        thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '',
        title: item.title ?? '',
      }))
      .filter((img: any) => img.url);

    res.json({ images, topImage: images[0]?.url ?? null });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? 'Search failed' });
  }
});

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

app.post('/api/analyze', async (req, res) => {
  const { imageUrl, imageBase64, mediaType, celebrityName, candidateUrls } = req.body as {
    imageUrl?: string;
    imageBase64?: string;
    mediaType?: string;
    celebrityName?: string;
    candidateUrls?: string[];
  };

  let base64: string;
  let resolvedType: string;

  try {
    if (imageBase64) {
      base64 = imageBase64;
      resolvedType = mediaType ?? 'image/jpeg';
    } else {
      // Try selected URL first, then fall back through all candidates
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

      if (!fetched) {
        return res.status(400).json({ error: 'No fetchable image in a supported format. Try selecting a different photo or use the upload tab.' });
      }
    }

    // Web lookup for factual brand/designer context before asking Claude
    let factContext = '';
    if (celebrityName) {
      try {
        const webRes = await fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: `${celebrityName} 2026 Met Gala outfit designer brand`, num: 5 }),
        });
        const webData = await webRes.json() as any;
        // Pull snippets and the answer box if present
        const answerBox = webData.answerBox?.answer ?? webData.answerBox?.snippet ?? '';
        const snippets = (webData.organic ?? []).slice(0, 4).map((r: any) => r.snippet ?? '').filter(Boolean).join(' ');
        const raw = [answerBox, snippets].filter(Boolean).join(' ').slice(0, 800);
        if (raw) factContext = `\n\nFACTUAL CONTEXT (use this for brand/designer — do not contradict it):\n${raw}`;
      } catch { /* non-fatal — analysis still runs without it */ }
    }

    const userText = [
      'Analyze this Met Gala look.',
      celebrityName && `Celebrity: ${celebrityName}.`,
      factContext,
    ].filter(Boolean).join(' ');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: resolvedType as any, data: base64 },
          },
          { type: 'text', text: userText },
        ],
      }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: 'No JSON in AI response' });

    res.json(JSON.parse(match[0]));
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? 'Analysis failed' });
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`API server on :${PORT}`));
