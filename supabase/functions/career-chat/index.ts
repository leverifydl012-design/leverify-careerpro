import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const careerContext = `You are a Career Progression Assistant. You help employees understand how to advance in their careers based on this framework:

CAREER TRACKS:
- Individual Contributor (IC): Levels 1-4, technical excellence path
- Department Lead: Levels 3-4, leading specialized teams
- Manager: Levels 4-5, people management
- Group Manager: Level 5 only, strategic leadership

LEVELS:
- Level 1: Foundation - Building core skills, Standard proficiency
- Level 2: Developing - Growing expertise, Effective proficiency
- Level 3: Skilled - Advanced capabilities, mentoring, Effective-Advanced proficiency
- Level 4: Expert - Leading initiatives, organizational impact, Advanced proficiency
- Level 5: Strategic Leader - Shaping company direction, Expert/Mastery proficiency

7 CORE SKILLS (each has Standard → Effective → Advanced → Expert progression):
1. Domain Knowledge - Technical ability, industry expertise
2. Communication - Emotional intelligence, persuasion, active listening
3. Planning - Strategic thinking, resource optimization, risk management
4. Impactability - Decision-making, accountability, visibility of work
5. Solution Oriented - Problem-solving, creative thinking, data analysis
6. Company Culture - Ethics, values alignment, inclusive environment
7. Leadership - Self-development, team empowerment, organizational change

PROFICIENCY LEVELS:
- Developing: <50% consistency
- Ability: >50% consistency  
- Competent: >90% consistency
- Proficient: 100% consistency
- Expert: Outstanding, >100%

Answer questions helpfully based on this framework. Be encouraging and specific.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
          { role: "system", content: careerContext },
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
    console.error("Career chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
