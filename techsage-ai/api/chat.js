// api/chat.js — Vercel Serverless Function
// This file runs on the server so the API key is NEVER sent to the browser.
// Uses OpenRouter API (openrouter.ai) — drop-in OpenAI-compatible endpoint.

const ASSISTANT_SYSTEM_PROMPT = `You are TechSage, a patient, warm, and friendly technology assistant for senior citizens aged 60 and above.

Your communication rules — follow these strictly:
- Use ONLY simple, everyday words. No jargon, acronyms, or technical terms unless you immediately explain them.
- Keep answers short: 3–5 sentences for simple questions, or a numbered list of steps (maximum 6 steps).
- Begin EVERY response with one short, reassuring sentence. Examples: "Great question!", "You can definitely do this!", "Don't worry, this is easy."
- When giving instructions, number each step clearly. Start each step with a strong action verb (e.g., "Tap", "Look for", "Type").
- Never say "as an AI" or "as a language model". Just be TechSage.
- If the user seems confused, offer to explain differently.
- If a question is about a scam or safety, be very clear: tell them what to do and what NOT to do.
- For Tamil language requests: respond entirely in Tamil with the same warm, simple tone.`

const SCAM_SYSTEM_PROMPT = `You are a scam detection assistant helping senior citizens stay safe online.

Analyze the message provided and respond with ONLY a JSON object in this exact format:
{
  "verdict": "SAFE" or "SUSPICIOUS" or "SCAM",
  "redFlags": ["flag 1", "flag 2", "flag 3"],
  "recommendation": "One clear sentence telling the senior exactly what to do."
}

Rules for your analysis:
- SCAM: Clear phishing, fraud, or social engineering attempt.
- SUSPICIOUS: Something feels off but not definitively a scam.
- SAFE: Normal, expected communication with no red flags.
- Red flags should be in plain language a senior citizen can understand. Maximum 3 red flags.
- Recommendation must be one sentence, very clear and actionable.
- For SAFE messages, redFlags should be an empty array [].
- Do NOT include any text outside the JSON object. No explanation, no preamble.`

function sanitizeInput(text) {
  // Remove HTML tags and limit length
  return String(text)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000)
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY is not set')
    return res.status(500).json({ error: 'Server configuration error. Please contact support.' })
  }

  const { message, mode = 'assistant', language = 'en' } = req.body || {}

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Please provide a message.' })
  }

  const cleanMessage = sanitizeInput(message)
  if (!cleanMessage) {
    return res.status(400).json({ error: 'Message cannot be empty.' })
  }

  const systemPrompt = mode === 'scam' ? SCAM_SYSTEM_PROMPT : ASSISTANT_SYSTEM_PROMPT

  // Add language instruction for assistant mode
  const userMessage = mode === 'assistant' && language === 'ta'
    ? `[Please respond in Tamil] ${cleanMessage}`
    : cleanMessage

  try {
    // OpenRouter uses the OpenAI-compatible /chat/completions endpoint.
    // The model string is "provider/model-name" — use claude-sonnet-4 via Anthropic on OpenRouter.
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.ALLOWED_ORIGIN || 'https://techsage-ai.vercel.app',
        'X-Title': 'TechSage AI',       // shows in OpenRouter dashboard
      },
      body: JSON.stringify({
        // model: 'anthropic/claude-sonnet-4',   // change to any OpenRouter model you like
        model: 'openai/gpt-oss-120b:free',   // change to any OpenRouter model you like
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userMessage  },
        ],
      }),
    })

    if (!openRouterRes.ok) {
      const errData = await openRouterRes.json().catch(() => ({}))
      console.error('OpenRouter API error:', openRouterRes.status, errData)
      return res.status(502).json({
        error: 'I am having trouble connecting right now. Please try again in a moment.'
      })
    }

    const data = await openRouterRes.json()
    // OpenRouter returns OpenAI-style response: choices[0].message.content
    const rawText = data.choices?.[0]?.message?.content || ''

    if (mode === 'scam') {
      // Parse the JSON response from scam mode
      try {
        // Strip any accidental markdown fences
        const clean = rawText.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)

        // Validate expected fields
        const verdict = ['SAFE', 'SUSPICIOUS', 'SCAM'].includes(parsed.verdict)
          ? parsed.verdict
          : 'SUSPICIOUS'

        return res.status(200).json({
          verdict,
          redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags.slice(0, 3) : [],
          recommendation: typeof parsed.recommendation === 'string'
            ? parsed.recommendation
            : 'If in doubt, do not respond and ask a trusted family member for help.',
        })
      } catch (parseErr) {
        // Claude didn't return clean JSON — still return something useful
        console.error('JSON parse error for scam mode:', rawText)
        return res.status(200).json({
          verdict: 'SUSPICIOUS',
          redFlags: ['Could not fully analyze this message'],
          recommendation: 'When in doubt, do not respond to this message. Show it to a family member.',
        })
      }
    }

    // Assistant mode — return plain text reply
    return res.status(200).json({ reply: rawText })

  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({
      error: 'Something went wrong. Please check your internet connection and try again.'
    })
  }
}
