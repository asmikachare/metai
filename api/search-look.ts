import type { IncomingMessage, ServerResponse } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { parseBody, sendJson, YEAR_THEMES } from './_shared.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { sendJson(res, 200, {}); return; }
  if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }

  const { name, year } = await parseBody(req);
  if (!name?.trim()) { sendJson(res, 400, { error: 'name required' }); return; }

  const metYear = year ?? 2026;
  const theme = YEAR_THEMES[metYear] ?? `${metYear} Met Gala`;
  const trimmedName = (name as string).trim();
  const serperHeaders = { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' };

  try {
    // Step 1: Web search for attendance evidence
    const verifyRes = await fetch('https://google.serper.dev/search', {
      method: 'POST', headers: serperHeaders,
      body: JSON.stringify({ q: `${trimmedName} ${metYear} Met Gala attended red carpet`, num: 8 }),
    }).then(r => r.json()).catch(() => null);

    const snippets = [
      verifyRes?.answerBox?.answer ?? '',
      verifyRes?.answerBox?.snippet ?? '',
      ...((verifyRes?.organic ?? []) as any[]).slice(0, 6).map((r: any) => `${r.title ?? ''}: ${r.snippet ?? ''}`),
    ].filter(Boolean).join('\n').slice(0, 1200);

    // Step 2: Claude verifies attendance from snippets — must be strict about the year
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

      sendJson(res, 200, { attended: false, images: [], suggestedYears, message: `${trimmedName} didn't attend the ${metYear} Met Gala.` });
      return;
    }

    // Step 4: Attended — image search with theme-specific query, fetch extra to allow filtering
    const imageRes = await fetch('https://google.serper.dev/images', {
      method: 'POST', headers: serperHeaders,
      body: JSON.stringify({ q: `${trimmedName} ${metYear} Met Gala ${theme} red carpet`, num: 10 }),
    }).then(r => r.json()).catch(() => null);

    const allImages = ((imageRes?.images ?? []) as any[])
      .slice(0, 10)
      .map((item: any) => ({ url: item.imageUrl ?? '', thumbnail: item.thumbnailUrl ?? item.imageUrl ?? '', title: item.title ?? '' }))
      .filter((img: any) => img.url);

    // Drop images whose titles mention a year other than metYear
    const yearFiltered = allImages.filter(img => {
      const yearsInTitle = (img.title.match(/\b(20\d{2})\b/g) ?? []).map(Number);
      if (yearsInTitle.length === 0) return true;
      return yearsInTitle.some((y: number) => y === metYear);
    });

    // Fall back to unfiltered if filtering removed too many
    const images = (yearFiltered.length >= 2 ? yearFiltered : allImages).slice(0, 5);

    sendJson(res, 200, { attended: true, images, topImage: images[0]?.url ?? null, suggestedYears: [] });
  } catch (err: any) {
    console.error(err);
    sendJson(res, 500, { error: err.message ?? 'Search failed' });
  }
}
