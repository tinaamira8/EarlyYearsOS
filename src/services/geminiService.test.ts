import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: { access_token: 'test-token' } } })),
    },
  },
}));

import { AiServiceError, generateNewsletter, generateRiskAssessment } from './geminiService';

describe('geminiService', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it('sends the authenticated request and validates structured output', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      text: '```json\n{"directorMsg":"Hello","events":"Open day","reminders":"Bring hats","curriculum":"Nature play"}\n```',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await generateNewsletter('June', 'Nature play', 'Bring hats');

    expect(result.curriculum).toBe('Nature play');
    expect(fetchMock).toHaveBeenCalledWith('/api/gemini', expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }));
  });

  it('surfaces server configuration errors instead of returning fake content', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify({ error: 'Gemini is not configured.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )));

    await expect(generateRiskAssessment('excursion', 'park', 'preschool')).rejects.toEqual(
      expect.objectContaining<Partial<AiServiceError>>({ message: 'Gemini is not configured.', status: 503 }),
    );
  });
});
