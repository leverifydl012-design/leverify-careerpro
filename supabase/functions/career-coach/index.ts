import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const coachSystemPrompt = `You are an expert Career Growth Coach. You give PRACTICAL, ACTIONABLE advice with REAL-WORLD EXAMPLES to help employees grow to their next job level.

IMPORTANT DATA RULES:
- The user context will include a structured list called "progressionRequirements".
- Each item contains:
  - skillName
  - requiredLevel (standard|effective|advanced|expert)
  - status (not_started|in_progress|completed)
  - necessaryRequirements (the official "Necessary requirements to progress to the next level" bullets from the Excel sheet)
- You MUST base your guidance primarily on these "necessaryRequirements" bullets when suggesting what to do next.

CAREER PROGRESSION:
- Job Levels run from Level 1 to Level 6.
- The user's role/track matters (IC, IC Enablement, Department Lead, Manager, Group Manager). Always tailor examples and actions to the user's role.
- If the user provides a designation/job title, tailor wording to match that designation (tools, responsibilities, stakeholders, scope).

7 CORE SKILLS: Domain Knowledge, Communication, Planning, Impactability, Solution Oriented, Company Culture, Leadership

RULES FOR YOUR RESPONSES:
1. Always give 3-5 SPECIFIC, PRACTICAL actions the person can take THIS WEEK
2. Include real-world examples like "Instead of just fixing the bug, document the root cause and share with your team in a 5-minute standup presentation"
3. Suggest books, courses, or frameworks they can use (be specific - name actual resources)
4. Give concrete metrics they can track (e.g., "Aim to mentor 2 junior colleagues per quarter")
5. Address the EMOTIONAL side too - imposter syndrome, confidence building, networking anxiety
6. Use encouraging, motivational language but stay practical
7. If they seem lost or blank-minded, start with the SIMPLEST first step and build up gradually
8. Format responses with clear headers, bullet points, and numbered steps
9. Always end with a "Quick Win" - something they can do in the next 30 minutes

When given user context (role, current level, target level, progressionRequirements), personalize advice deeply and reference the exact required skills and their necessaryRequirements.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let contextualPrompt = coachSystemPrompt;
    if (context) {
      contextualPrompt += `\n\nUSER CONTEXT:
- Current Level: ${context.currentLevel || 'Unknown'}
- Target Level: ${context.targetLevel || 'Unknown'}
- Role/Track: ${context.careerRoleName || context.careerTrack || 'Unknown'}
- Designation: ${context.designation || 'Not provided'}
- Completed Skills: ${context.completedSkills?.join(', ') || 'None yet'}
- In-Progress Skills: ${context.inProgressSkills?.join(', ') || 'None yet'}
- Active Goals: ${context.activeGoals?.join(', ') || 'None set'}

PROGRESSION REQUIREMENTS (authoritative):
${Array.isArray(context.progressionRequirements) && context.progressionRequirements.length
  ? context.progressionRequirements.map((r: any) => {
      const nec = Array.isArray(r.necessaryRequirements) ? r.necessaryRequirements : [];
      return `- ${r.skillName} → required: ${r.requiredLevel} | status: ${r.status}\n  Necessary requirements:\n${nec.map((x: string) => `  - ${x}`).join("\n")}`;
    }).join("\n")
  : "- (none provided)"}

Use this context to give HIGHLY PERSONALIZED advice. Start by identifying the 2-3 biggest gaps (not_started/in_progress) and turn the necessaryRequirements into concrete weekly actions and examples for their role.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Career coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
