
import { GoogleGenAI } from "@google/genai";

// ------------------------------------------------------------------
// THIS FILE RUNS ON THE SERVER (e.g., Supabase Edge Function / Netlify)
// ------------------------------------------------------------------

// In a real deployment, this comes from the server environment
const API_KEY = process.env.API_KEY; 

// Only initialize if key exists, otherwise let handleGeminiRequest handle the error
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function handleGeminiRequest(req: Request) {
  if (!API_KEY || !ai) {
    return new Response(JSON.stringify({ error: "Server Misconfiguration: No API Key" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }

  const { action, payload } = await req.json();

  try {
    let result;

    switch (action) {
      case 'generateMenu':
        // Prompt logic moved here to keep it secret/secure
        const menuPrompt = `Create a 5-day weekly menu for an Australian Childcare Centre. Ensure it meets the Australian Dietary Guidelines and is culturally inclusive. Season: ${payload.season}. Preferences: ${payload.preferences}. Allergies: ${payload.allergies.join(', ')}. Return as a JSON array of 5 objects with day, morningTea, lunch, afternoonTea.`;
        const menuResp = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: menuPrompt,
            config: { 
                responseMimeType: "application/json",
                systemInstruction: "You are a professional chef for early childhood education centres in Australia. Follow EYLF V2.0 principles of health and wellbeing."
            }
        });
        result = menuResp.text ? JSON.parse(menuResp.text) : [];
        break;

      case 'generateLearningStory':
        const storyPrompt = `Write a pedagogical learning story for ${payload.childName} (Age: ${payload.age}). 
        Context: ${payload.context}
        Notes: ${payload.notes}
        
        CRITICAL: The story, analysis, and follow-up MUST strictly align with the Early Years Learning Framework (EYLF) V2.0 (2022).
        Return as JSON: { title, story, analysis, followUp }.`;
        const storyResp = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: storyPrompt,
            config: { 
                responseMimeType: "application/json",
                systemInstruction: "You are an expert Early Childhood Educator in Australia. All documentation MUST map to EYLF V2.0 (2022) outcomes."
            }
        });
        result = storyResp.text ? JSON.parse(storyResp.text) : null;
        break;

      // ... Add cases for Risk Assessment, QIP, etc. ...
      
      default:
        return new Response("Unknown Action", { status: 400 });
    }

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "AI Generation Failed" }), { status: 500 });
  }
}
