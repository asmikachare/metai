import type { IncomingMessage, ServerResponse } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { parseBody, sendJson, YEAR_THEMES } from './_shared.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') { sendJson(res, 200, {}); return; }
  if (req.method !== 'POST') { sendJson(res, 405, { error: 'Method not allowed' }); return; }

  const { year } = await parseBody(req);
  if (!year) { sendJson(res, 400, { error: 'year required' }); return; }

  const theme = YEAR_THEMES[year] ?? `${year} Met Gala`;
  const serperHeaders = { 'X-API-KEY': process.env.SERPER_API_KEY!, 'Content-Type': 'application/json' };

  const [imageResult, claudeResult] = await Promise.allSettled([
    fetch('https://google.serper.dev/images', {
      method: 'POST', headers: serperHeaders,
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

  sendJson(res, 200, {
    images,
    blurb: editorial?.blurb ?? '',
    must_knows: editorial?.must_knows ?? [],
  });
}
