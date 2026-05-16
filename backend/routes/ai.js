const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini
let genAI = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'PASTE_YOUR_KEY_HERE') {
  genAI = new GoogleGenerativeAI(apiKey);
}

const SYSTEM_PROMPT = `You are KisanAI, an expert agricultural advisor for Indian smallholder farmers.
You provide practical, actionable farming advice based on the farmer's region, crop, current month, and weather.
Keep responses concise (3-4 sentences max), simple language, and practical.
You can respond in Hindi, English, or the language the farmer uses.
Focus on: planting schedules, irrigation, pest management, fertilizer use, and weather adaptation.`;

// ── Mock fallbacks ──
const mockAdvice = (ctx) =>
  `Based on ${ctx.crop} in ${ctx.region} for ${ctx.month}, current activity is ${ctx.activity}. Temperature is ${ctx.temp}°C with ${ctx.rainfall}mm rain. Proceed with ${ctx.activity} and monitor fields carefully.`;

const mockChat = (msg, ctx) => {
  const q = msg.toLowerCase();
  if (q.includes('urea') || q.includes('fertilizer'))
    return 'For urea, apply 1/3rd at sowing time and rest in two equal splits at 30 and 60 days. Avoid before heavy rain.';
  if (q.includes('yellow'))
    return 'Yellowing leaves likely indicate nitrogen deficiency. Apply foliar spray of 2% urea solution.';
  if (q.includes('rain') || q.includes('barish'))
    return `For ${ctx.region}, expect around ${ctx.rainfall || 100}mm rainfall. Plan irrigation accordingly.`;
  return `Focus on ${ctx.activity} for your ${ctx.crop} this month. Monitor soil moisture given ${ctx.temp}°C temperatures.`;
};

const mockDiagnosis = () => {
  const diseases = [
    { name: 'Leaf Blight', severity: 'High', cause: 'Fungal infection from high humidity', treatment: 'Apply Mancozeb 75% WP at 2g/liter. Remove affected leaves.', prevention: 'Proper plant spacing. Avoid overhead irrigation.' },
    { name: 'Nitrogen Deficiency', severity: 'Medium', cause: 'Poor soil nutrition or rain leaching', treatment: 'Apply Urea top dressing. Foliar spray of 2% urea.', prevention: 'Follow recommended NPK schedule.' },
    { name: 'Aphid Infestation', severity: 'Medium', cause: 'Pest attack', treatment: 'Spray Neem oil 2ml/liter. If severe, use Imidacloprid.', prevention: 'Clean field borders. Encourage ladybugs.' },
  ];
  return diseases[Math.floor(Math.random() * diseases.length)];
};

// ── POST /api/advice ──
router.post('/advice', async (req, res) => {
  try {
    const { context } = req.body;
    if (!genAI) return res.json({ response: mockAdvice(context) });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `${SYSTEM_PROMPT}\n\nFarmer context:\n- Region: ${context.region}\n- Crop: ${context.crop}\n- Month: ${context.month}\n- Activity: ${context.activity}\n- Temperature: ${context.temp}°C\n- Rainfall: ${context.rainfall}mm\n\nGive specific, actionable advice for this farmer right now.`;

    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (err) {
    console.error('Advice error:', err.message);
    res.json({ response: mockAdvice(req.body.context) });
  }
});

// ── POST /api/chat ──
router.post('/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const lastMsg = messages[messages.length - 1].content;

    if (!genAI) return res.json({ response: mockChat(lastMsg, context) });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: `${SYSTEM_PROMPT}\n\nCurrent context: Growing ${context.crop} in ${context.region}, month: ${context.month}, activity: ${context.activity}.`,
    });

    const result = await chat.sendMessage(lastMsg);
    res.json({ response: result.response.text() });
  } catch (err) {
    console.error('Chat error:', err.message);
    const lastMsg = req.body.messages[req.body.messages.length - 1].content;
    res.json({ response: mockChat(lastMsg, req.body.context) });
  }
});

// ── POST /api/diagnose ──
router.post('/diagnose', async (req, res) => {
  try {
    const { image, context } = req.body;
    if (!genAI || !image) return res.json(mockDiagnosis());

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Strip data URL prefix to get raw base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are an agricultural plant disease expert. Analyze this plant image.
The farmer is growing ${context.crop} in ${context.region} during ${context.month}.

Respond ONLY in this exact JSON format (no markdown, no code fences):
{"name":"disease name","severity":"High/Medium/Low","cause":"brief cause","treatment":"specific treatment with dosage","prevention":"prevention tips"}`;

    const result = await model.generateContent([
      { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
      { text: prompt },
    ]);

    const text = result.response.text().trim();
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.json(JSON.parse(jsonMatch[0]));
    } else {
      res.json(mockDiagnosis());
    }
  } catch (err) {
    console.error('Diagnosis error:', err.message);
    res.json(mockDiagnosis());
  }
});

module.exports = router;
