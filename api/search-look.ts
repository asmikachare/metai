import type { IncomingMessage, ServerResponse } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { parseBody, sendJson, deprioritizeStock, YEAR_THEMES } from './_shared.js';

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

      sendJson(res, 200, { attended: false, images: [], suggestedYears, message: `${trimmedName} didn't attend the ${metYear} Met Gala.` });
      return;
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

    sendJson(res, 200, { attended: true, images, topImage: images[0]?.url ?? null, suggestedYears: [] });
  } catch (err: any) {
    console.error(err);
    sendJson(res, 500, { error: err.message ?? 'Search failed' });
  }
}
