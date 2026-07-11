import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const geminiApiKey = process.env.GEMINI_API_KEY;
const gemini = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const AI_RATE_LIMIT = Number(process.env.AI_RATE_LIMIT) || 30;
const AI_RATE_WINDOW_MS = 60_000;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!gemini) {
    return res.status(503).json({ error: 'Gemini is not configured.' });
  }

  const requesterId = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  const now = Date.now();
  const currentLimit = rateLimits.get(requesterId);
  const nextLimit = !currentLimit || currentLimit.resetAt <= now
    ? { count: 1, resetAt: now + AI_RATE_WINDOW_MS }
    : { ...currentLimit, count: currentLimit.count + 1 };
  rateLimits.set(requesterId, nextLimit);
  res.setHeader('X-RateLimit-Limit', AI_RATE_LIMIT);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, AI_RATE_LIMIT - nextLimit.count));
  res.setHeader('Cache-Control', 'no-store');

  if (nextLimit.count > AI_RATE_LIMIT) {
    return res.status(429).json({ error: 'AI request limit reached. Please wait a few minutes and try again.' });
  }

  const { prompt, responseMimeType, image, useSearch } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'A prompt is required.' });
  }
  if (prompt.length > 12_000) {
    return res.status(413).json({ error: 'The AI prompt is too large.' });
  }
  if (responseMimeType && responseMimeType !== 'application/json') {
    return res.status(400).json({ error: 'Unsupported AI response format.' });
  }

  try {
    const contents = image?.data && image?.mimeType
      ? { parts: [{ inlineData: { data: image.data, mimeType: image.mimeType } }, { text: prompt }] }
      : prompt;

    const response = await gemini.models.generateContent({
      model: image ? 'gemini-2.5-flash-image' : (process.env.GEMINI_MODEL || 'gemini-2.5-flash'),
      contents,
      config: {
        ...(responseMimeType ? { responseMimeType } : {}),
        ...(useSearch ? { tools: [{ googleSearch: {} }] } : {}),
        systemInstruction: 'You are an expert Early Childhood Educator assistant in Australia. Align educational guidance with EYLF V2.0 and clearly distinguish operational guidance from legal or medical advice.',
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData)?.inlineData;
    res.json({
      text: response.text || '',
      image: imagePart?.data ? { data: imagePart.data, mimeType: imagePart.mimeType || 'image/png' } : null,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(502).json({ error: 'AI generation failed.' });
  }
}
