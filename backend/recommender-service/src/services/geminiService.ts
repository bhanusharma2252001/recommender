import axios from 'axios';

export interface GeminiRequestOptions {
  model?: string;
  prompt: string;
}

export async function callGeminiAPI(opts: GeminiRequestOptions): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  const model = opts.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  
  // Use Generative Language REST API endpoint pattern.
  const base = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const url = `${base}/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    contents: [
    {
      "parts": [
        {
          "text": opts.prompt
        }
      ]
    }
  ]
  };
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-goog-api-key': apiKey
  };
  const resp = await axios.post(url, body, { headers, timeout: 20000 });
  return resp.data;
}
