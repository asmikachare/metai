import type { IncomingMessage, ServerResponse } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { parseBody, sendJson, getDefaultPillars, buildSystemPrompt, YEAR_THEMES } from './_shared.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { sendJson(res, 200, {}); return; }
  if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }

  const { imageUrl, imageBase64, mediaType, celebrityName, candidateUrls, year } = await parseBody(req);

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
        ...(candidateUrls ?? []).filter((u: string) => u !== imageUrl),
      ];
      if (!urlsToTry.length) { sendJson(res, 400, { error: 'Provide imageUrl or imageBase64' }); return; }

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
      if (!fetched) { sendJson(res, 400, { error: 'No fetchable image in a supported format. Try selecting a different photo or use the upload tab.' }); return; }
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
        { type: 'image', source: { type: 'base64', media_type: resolvedType! as any, data: base64! } },
        { type: 'text', text: userText },
      ]}],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) { sendJson(res, 500, { error: 'No JSON in AI response' }); return; }

    const result = JSON.parse(match[0]);
    result.pillar_labels = getDefaultPillars(metYear);
    result.met_year = metYear;
    result.met_theme = theme;

    sendJson(res, 200, result);
  } catch (err: any) {
    console.error(err);
    sendJson(res, 500, { error: err.message ?? 'Analysis failed' });
  }
}
