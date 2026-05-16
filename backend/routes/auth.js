const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory OTP store (for demo — use Redis/DB in production)
const otpStore = new Map();

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit phone number required' });
  }

  const otp = String(Math.floor(1000 + Math.random() * 9000)); // 4-digit OTP
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

  console.log(`📱 OTP for ${phone}: ${otp}`);

  // In production, send SMS via Twilio/MSG91 here
  res.json({ success: true, message: 'OTP sent successfully', demoOtp: otp });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore.get(phone);

  if (!stored) {
    return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  otpStore.delete(phone);

  const token = jwt.sign({ phone }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
  res.json({ success: true, token, phone });
});

module.exports = router;
