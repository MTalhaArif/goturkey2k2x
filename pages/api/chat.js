import Anthropic from '@anthropic-ai/sdk';
import { retrieveChunks, formatChunksForPrompt } from '@/lib/rag/retrieve';
import { checkAndIncrement, DAILY_MESSAGE_CAP } from '@/lib/rag/rateLimit';

export const config = {
  api: {
    bodyParser: { sizeLimit: '200kb' },
  },
};

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const SYSTEM_PROMPT = `You are the GoTurkey 2k2x Assistant, a helpful chat widget on the GoTurkey 2k2x study-abroad consultancy website. GoTurkey 2k2x helps international students apply to Turkish universities and settle in Turkey.

Rules:
- Answer ONLY using the "Relevant information" context provided with each question. Do not invent university programs, fees, timelines, or guarantees that are not in the context.
- If the context doesn't cover the question, say so honestly and direct the student to contact the team by email (talhasays94@gmail.com), phone/WhatsApp (+90 537 699 43 02), or to register/log in to their student dashboard for account-specific help.
- Keep answers concise and friendly — a few sentences or a short list, not long essays.
- Write in plain text only — no markdown (no **bold**, no # headings, no backticks). The chat widget displays raw text, so use plain numbered/dashed lines and line breaks instead.
- When relevant, suggest a concrete next step (e.g. "you can start this from your student dashboard" or "check the Universities page").
- Never ask for or reference sensitive personal data (passwords, full document contents).`;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return false;
  }
  return messages.every(
    (m) =>
      m &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.content === 'string' &&
      m.content.length > 0 &&
      m.content.length <= MAX_MESSAGE_LENGTH
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body || {};
  if (!validateMessages(messages) || messages[messages.length - 1].role !== 'user') {
    res.status(400).json({ error: 'Invalid request.' });
    return;
  }

  const ip = getClientIp(req);
  let allowed;
  try {
    allowed = await checkAndIncrement(ip);
  } catch (error) {
    console.error('Rate limit check failed:', error);
    res.status(500).json({ error: 'Chat service is temporarily unavailable. Please try again shortly.' });
    return;
  }

  if (!allowed) {
    res.status(429).json({
      error: `You've reached today's limit of ${DAILY_MESSAGE_CAP} messages. Please try again tomorrow, or contact us directly at talhasays94@gmail.com.`,
    });
    return;
  }

  const latestMessage = messages[messages.length - 1].content;
  const chunks = retrieveChunks(latestMessage);
  const augmentedContent = `Relevant information:\n${formatChunksForPrompt(chunks)}\n\nStudent question: ${latestMessage}`;

  const apiMessages = [
    ...messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: augmentedContent },
  ];

  const client = new Anthropic();
  let headersSent = false;

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      output_config: { effort: 'low' },
      messages: apiMessages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        if (!headersSent) {
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
          headersSent = true;
        }
        res.write(event.delta.text);
      }
    }
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    if (headersSent) {
      res.end();
      return;
    }
    if (error instanceof Anthropic.AuthenticationError) {
      res.status(500).json({ error: 'Chat service is not configured correctly. Please contact the site administrator.' });
    } else if (error instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: 'The assistant is receiving too many requests right now. Please try again in a moment.' });
    } else {
      res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again shortly.' });
    }
  }
}
