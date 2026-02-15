import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const ai = env.geminiApiKey ? new GoogleGenAI({ apiKey: env.geminiApiKey }) : null;

export async function generateMarketingCampaign(clientName: string, recentService: string, promoType: 'loyalty' | 're-engagement' | 'birthday') {
  if (!ai) return 'GEMINI_API_KEY não configurada no backend.';

  const prompts = {
    loyalty: `Write a premium, short, and elegant WhatsApp message for a client named ${clientName} who just completed a ${recentService}. Offer them 10% off their next visit as a VIP loyalty reward at SPA DO CÍLIOS. Keep it under 200 characters and use emojis politely. Language: Portuguese.`,
    're-engagement': `Write a premium invitation for ${clientName} to return to SPA DO CÍLIOS. They haven't visited in 30 days. Remind them of the relaxing experience at our spa. Language: Portuguese.`,
    birthday: `Write a sophisticated birthday wish for ${clientName}. Offer a complimentary hair hydration service with any color procedure booked this month at SPA DO CÍLIOS. Language: Portuguese.`,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompts[promoType],
    config: { temperature: 0.7 },
  });

  return response.text;
}
