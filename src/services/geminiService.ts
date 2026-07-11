
import { supabase } from './supabaseClient';

type GeminiServerResponse = { text: string; image?: { data: string; mimeType: string } | null };

export class AiServiceError extends Error {
    constructor(message: string, public readonly status?: number) {
        super(message);
        this.name = 'AiServiceError';
    }
}

const parseJson = <T>(value: string): T => {
    const cleaned = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    try {
        return JSON.parse(cleaned) as T;
    } catch {
        throw new AiServiceError('The AI returned an invalid structured response. Please try again.');
    }
};

async function requestGemini(prompt: string, config: { responseMimeType?: string } = {}, options: { image?: { data: string; mimeType: string }; useSearch?: boolean } = {}): Promise<GeminiServerResponse | null> {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ prompt, responseMimeType: config.responseMimeType, ...options }),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({})) as { error?: string };
        throw new AiServiceError(body.error || 'AI generation failed. Please try again.', response.status);
    }
    return await response.json() as GeminiServerResponse;
}

// --- REAL BACKEND CALLER ---
async function callSecureBackend(action: string, payload: any) {
    const prompts: Record<string, string> = {
        generateMenu: `Create a five-day Australian childcare menu for ${payload.season}. Preferences: ${payload.preferences}. Allergies: ${(payload.allergies || []).join(', ')}. Return JSON array fields: day, morningTea, lunch, afternoonTea.`,
        generateLearningStory: `Create an EYLF V2.0 learning story as JSON with fields title, story, analysis, followUp. Child: ${payload.childName}; age: ${payload.age}; context: ${payload.context}; notes: ${payload.notes}.`,
    };
    const prompt = prompts[action];
    if (!prompt) throw new AiServiceError(`Unsupported AI action: ${action}`);
    const result = await requestGemini(prompt, { responseMimeType: 'application/json' });
    if (!result?.text) throw new AiServiceError('The AI returned an empty response.');
    return parseJson(result.text);
}

// --- PUBLIC EXPORTS ---

export const generateMenu = async (season: string, preferences: string, allergies: string[]) => {
  return await callSecureBackend('generateMenu', { season, preferences, allergies }) as Array<{ day: string; morningTea: string; lunch: string; afternoonTea: string }>;
};

export const generateLearningStory = async (childName: string, age: string, context: string, notes: string) => {
  return await callSecureBackend('generateLearningStory', { childName, age, context, notes }) as { title: string; story: string; analysis: string; followUp: string };
};

export const generateRosterInsights = async (rosterData: any, rooms: any[], children: any[]) => {
    const prompt = `Analyze this childcare roster and enrolment data to provide 3 actionable staffing insights.
    Roster: ${JSON.stringify(rosterData)}
    Rooms: ${JSON.stringify(rooms)}
    Children: ${JSON.stringify(children)}
    
    Return a JSON array of strings, each string being a concise tip.`;
    const text = await safeGenerateContent(prompt, { responseMimeType: "application/json" });
    return parseJson<string[]>(text);
};

export async function safeGenerateContent(prompt: string, config: { responseMimeType?: string } = {}) {
    const result = await requestGemini(prompt, config);
    if (!result?.text?.trim()) throw new AiServiceError('The AI returned an empty response.');
    return result.text;
}

export const generateGoalTimeline = async (goal: string, area: string) => {
    const prompt = `Draft a specific, measurable, achievable, relevant and time-bound QIP goal for this identified gap: "${goal}" in NQS Area "${area}". Return JSON with fields smartGoal (string) and steps (array of strings).`;
    const text = await safeGenerateContent(prompt, { responseMimeType: "application/json" });
    return parseJson<{ smartGoal: string; steps: string[] }>(text);
};

export const chatWithExpert = async (message: string, history: any[]) => {
    const recentContext = history.slice(-6).map(item => `${item.from === 'user' ? 'User' : 'Assistant'}: ${String(item.text).slice(0, 1200)}`).join('\n');
    const response = await requestGemini(`Conversation context:\n${recentContext}\n\nCurrent question: ${message}`, {}, { useSearch: true });
    if (!response?.text?.trim()) throw new AiServiceError('The AI returned an empty answer.');
    return { text: response.text, sources: [] };
};

export const editDocumentationPhoto = async (base64Image: string, prompt: string) => {
    const mimeType = base64Image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/png';
    const data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const response = await requestGemini(`Edit this documentation photo: ${prompt}`, {}, { image: { mimeType, data } });
    if (!response?.image?.data) throw new AiServiceError('The AI did not return an edited image.');
    return `data:${response.image.mimeType};base64,${response.image.data}`;
};

export const generateNewsletter = async (week: string, highlights: string, reminders: string) => {
    const text = await safeGenerateContent(`Draft a concise, warm Australian early learning centre newsletter for ${week}. Highlights: ${highlights}. Reminders: ${reminders}. Return JSON with string fields directorMsg, events, reminders and curriculum. Do not invent dates or safety requirements.`, { responseMimeType: 'application/json' });
    return parseJson<{ directorMsg: string; events: string; reminders: string; curriculum: string }>(text);
};

export const translateText = async (text: string, lang: string) => {
    return await safeGenerateContent(`Translate to ${lang}: ${text}`);
};

export const translateLearningStory = async (storyData: any, targetLang: string) => {
    const text = await safeGenerateContent(`Translate JSON to ${targetLang}: ${JSON.stringify(storyData)}`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const generateRiskAssessment = async (activity: string, location: string, ageGroup: string) => {
    const text = await safeGenerateContent(`Risk Assessment JSON for ${activity} at ${location} for ${ageGroup}. Fields: overallRating, hazards[{hazard, risk, control}]`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const generateActivityPlan = async (interest: string, ageGroup: string) => {
    const text = await safeGenerateContent(`5 Activity Plan JSON for ${interest} (${ageGroup}). Fields: title, description, eylfLink, voicePrompt, resources[]`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const generateDevelopmentSummary = async (name: string, period: string, strengths: string, goals: string) => {
    return await safeGenerateContent(`Dev Summary for ${name}. Strengths: ${strengths}. Goals: ${goals}. Markdown.`);
};

export const generateCriticalReflection = async (topic: string, perspective: string) => {
    return await safeGenerateContent(`Reflect on ${topic} via ${perspective}. Markdown.`);
};

export const generatePhilosophy = async (values: string, approaches: string) => {
    const text = await safeGenerateContent(`Draft an Australian early learning service philosophy. Values: ${values}. Educational approaches: ${approaches}. Return JSON with string fields vision, values, approach and commitments. Keep claims grounded in the supplied information.`, { responseMimeType: 'application/json' });
    return parseJson<{ vision: string; values: string; approach: string; commitments: string }>(text);
};

export const generateSchoolReadinessPlan = async (domain: string, interest: string) => {
    const text = await safeGenerateContent(`3 School Readiness Activities JSON. Domain: ${domain}. Interest: ${interest}.`, { responseMimeType: "application/json" });
    return parseJson<Array<{ title: string; description?: string; readinessSkill?: string; eylfOutcome?: string }>>(text);
};

export const getQuickActivities = async (category: string, age: string) => {
    const text = await safeGenerateContent(`6 ${category} activities for ${age}. Return a JSON array with objects containing: title, objective, materials (array of strings), instructions.`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const analyzeRoomSetup = async (items: string[], roomType: string) => {
    const text = await safeGenerateContent(`Analyze room: ${items.join(', ')} (${roomType}). JSON: trafficFlow, supervision, inclusion.`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const generateIncidentReport = async (data: any) => {
    const text = await safeGenerateContent(`Incident Report JSON for ${JSON.stringify(data)}.`, { responseMimeType: "application/json" });
    return parseJson(text);
};

export const generateChildProtectionPolicy = async (org: string, state: string) => {
    return await safeGenerateContent(`Child Protection Policy for ${org} (${state}). Markdown.`);
};

export const generateCodeOfConduct = async (org: string, focusAreas: string[]) => {
    return await safeGenerateContent(`Code of Conduct for ${org}. Areas: ${focusAreas.join(',')}. Markdown.`);
};

export const generateMaintenanceRequest = async (issues: string[]) => {
    return await safeGenerateContent(`Maintenance email for: ${issues.join(',')}. Markdown.`);
};

export const generateParentDailyReport = async (child: string, summary: string) => {
    return await safeGenerateContent(`Daily email for ${child}: ${summary}. Markdown.`);
};

export const evaluateEmergencyDrill = async (type: string, time: string, notes: string) => {
    return await safeGenerateContent(`Evaluate drill: ${type}, ${time}, ${notes}. Markdown.`);
};

export const generateTransitionStatement = async (name: string, interests: string, learning: string, inclusion: string, family: string) => {
    const prompt = `Write a formal "Transition to School" statement for ${name}.
    Interests: ${interests}
    Learning & Development: ${learning}
    Inclusion & Support: ${inclusion}
    Family Comments: ${family}
    Use a professional, strengths-based tone. Return JSON with string fields strengths, dispositions, relationships, keyExperiences and additionalInfo. Do not invent diagnoses, family details, or observations.`;
    const text = await safeGenerateContent(prompt, { responseMimeType: 'application/json' });
    return parseJson<{ strengths: string; dispositions: string; relationships: string; keyExperiences: string; additionalInfo: string }>(text);
};

export const generateCulturalAuditSuggestions = async (incompleteItems: string[]) => {
    const prompt = `I am conducting a Cultural Competency Audit in an Early Childhood Education setting.
    The following areas need improvement: ${incompleteItems.join(', ')}.
    Provide 3-5 actionable, respectful suggestions on how to embed Aboriginal and Torres Strait Islander perspectives and other cultures into the daily program. Markdown.`;
    return await safeGenerateContent(prompt);
};

export const suggestEYLFOutcomes = async (notes: string, childAge?: string): Promise<{ outcomes: { id: string; name: string; reason: string }[]; extensions: string[] }> => {
    const text = await safeGenerateContent(
      `Given these observation notes about a child${childAge ? ` aged ${childAge}` : ''} in an Australian early learning setting:
"${notes}"

Map to EYLF V2.0 Learning Outcomes. Return JSON with:
- outcomes: array of {id (e.g. "1.1"), name (outcome name), reason (one sentence linking notes to outcome)}
- extensions: array of 2-3 suggested follow-up activities to extend the learning

Use only official EYLF V2.0 outcomes (1.1-1.4, 2.1-2.4, 3.1-3.2, 4.1-4.4, 5.1-5.5).`,
      { responseMimeType: 'application/json' }
    );
    return parseJson(text);
};

export const suggestNextSteps = async (childName: string, recentObservations: string[]): Promise<string[]> => {
    const text = await safeGenerateContent(
      `Based on these recent observations for ${childName}:
${recentObservations.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Suggest 3-5 specific next steps or intentional teaching strategies aligned with EYLF V2.0. Return JSON array of strings.`,
      { responseMimeType: 'application/json' }
    );
    return parseJson(text);
};
