require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '10mb' })); // large limit for base64 images

app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'PASTE_YOUR_KEY_HERE' });
});

app.listen(PORT, () => {
  console.log(`\n🌱 KisanAI Backend running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'PASTE_YOUR_KEY_HERE') {
    console.log('⚠️  GEMINI_API_KEY not set — AI endpoints will use mock responses');
  } else {
    console.log('✅ Gemini AI connected');
  }
});
