import type { IncomingMessage, ServerResponse } from 'node:http';
import { parseBody, sendJson } from './_shared.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { sendJson(res, 200, {}); return; }
  if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }

  const { name, year } = await parseBody(req);
  if (!name?.trim()) { sendJson(res, 400, { error: 'name required' }); return; }

  const metYear = year ?? 2026;
  const serperHeaders = { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' };

  try {
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

    const verifyText = ((verifyRes?.organic ?? []) as any[])
      .map((r: any) => `${r.title ?? ''} ${r.snippet ?? ''}`)
      .join(' ')
      .toLowerCase();
    const nameToken = name.trim().toLowerCase().split(' ')[0];
    const attended = verifyText.includes(nameToken) && verifyText.includes(String(metYear));

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

    sendJson(res, 200, { images, topImage: images[0]?.url ?? null, attended: attended || images.length > 0, suggestedYears });
  } catch (err: any) {
    console.error(err);
    sendJson(res, 500, { error: err.message ?? 'Search failed' });
  }
}
