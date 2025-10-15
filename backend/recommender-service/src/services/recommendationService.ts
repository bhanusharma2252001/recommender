import { Recommendation } from '../types';
import { callGeminiAPI } from './geminiService';

export class RecommendationService {
  async generateMockRecommendations(topics: string[], skillLevel?: string): Promise<Recommendation[]> {
    return topics.slice(0,3).map((t, i) => ({
      title: `${skillLevel || 'Intro'} to ${t}`,
      description: `Hands-on ${t} course`,
      duration: `${2 + i}h`,
      url: `https://example.com/${t}`
    }));
  }

   // Helper: try parsing JSON from a string that may include code fences or extra text
   tryParseJsonArray = (s: string): any[] | null => {
    if (!s || typeof s !== 'string') return null;
    let cleaned = s.trim();

    // 1) Remove surrounding ```json ... ``` or ``` ... ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // 2) If it still contains leading/trailing non-JSON, try to extract the first JSON array substring
    try {
      const maybe = JSON.parse(cleaned);
      if (Array.isArray(maybe)) return maybe;
    } catch (e) {
      // continue to extraction
    }

    // 3) Find first '[' and last ']' to extract potential JSON array
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const jsonSub = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        const parsed = JSON.parse(jsonSub);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // continue to extraction
      }
    }

    // 4) last attempt, try to find a top-level object array with regex (DOTALL)
    const arrMatch = cleaned.match(/(\[([\s\S]*?)\])/m);
    if (arrMatch && arrMatch[1]) {
      try {
        const parsed = JSON.parse(arrMatch[1]);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // failed to parse
      }
    }

    return null;
  };


 async generateFromGemini(topics: string[], skillLevel?: string) : Promise<Recommendation[]> {
  const prompt = `Provide 5 course recommendations for topics: ${topics.join(', ')} at skill level: ${skillLevel || 'any'}. Respond as JSON array with fields title, description, duration, url.`;
  const data = await callGeminiAPI({ prompt });

  // Defensive extraction of the text content from Gemini response
  const rawText: string = (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.text ||
    data?.output?.[0]?.content ||
    JSON.stringify(data)
  );

  const parsed = this.tryParseJsonArray(rawText);

  if (parsed && Array.isArray(parsed)) {
    // Normalize items to Recommendation shape 
    const recs: Recommendation[] = parsed.map((item: any) => ({
      title: String(item.title ?? item.name ?? ''),
      description: String(item.description ?? item.summary ?? ''),
      duration: item.duration ? String(item.duration) : undefined,
      url: item.url ?? item.link ?? undefined
    }));
    return recs;
  }

  // Fallback: return raw text as single recommendation
  return [{
    title: 'gemini-response',
    description: typeof rawText === 'string' ? rawText : JSON.stringify(rawText),
  }];
}

}

export const recommendationService = new RecommendationService();
