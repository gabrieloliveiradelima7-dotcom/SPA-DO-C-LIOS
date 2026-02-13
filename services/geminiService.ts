import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketingCampaign = async (clientName: string, recentService: string, promoType: 'loyalty' | 're-engagement' | 'birthday') => {
  const prompts = {
    loyalty: `Write a premium, short, and elegant WhatsApp message for a client named ${clientName} who just completed a ${recentService}. Offer them 10% off their next visit as a VIP loyalty reward at SPA DO CÍLIOS. Keep it under 200 characters and use emojis politely. Language: Portuguese.`,
    're-engagement': `Write a premium invitation for ${clientName} to return to SPA DO CÍLIOS. They haven't visited in 30 days. Remind them of the relaxing experience at our spa. Language: Portuguese.`,
    birthday: `Write a sophisticated birthday wish for ${clientName}. Offer a complimentary hair hydration service with any color procedure booked this month at SPA DO CÍLIOS. Language: Portuguese.`
  };

  try {
    // Calling generateContent with the correct model and prompt structure
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompts[promoType],
      config: {
        temperature: 0.7,
      }
    });
    // Accessing .text as a property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao gerar mensagem. Verifique a chave da API.";
  }
};

export const analyzeSalonPerformance = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these salon KPIs for SPA DO CÍLIOS and suggest 3 business improvements: ${JSON.stringify(data)}. Focus on increasing recurrence and ticket average. Language: Portuguese.`,
    });
    // Accessing .text as a property
    return response.text;
  } catch (error) {
    return "Error analyzing performance data.";
  }
};