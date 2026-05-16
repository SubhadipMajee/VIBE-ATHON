import React, { useState } from 'react';
import { Leaf, Globe } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { languages } from '../data/translations';

const API = 'http://localhost:5000/api';

const Login = ({ onLogin }) => {
  const { lang, setLang, t } = useLang();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        // Show the demo OTP to the user
        if (data.demoOtp) {
          setOtp(data.demoOtp);
        }
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      // Fallback if backend is not running
      setOtpSent(true);
      setOtp('1234');
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 4) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('kisanai_token', data.token);
        onLogin();
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      // Fallback if backend is not running
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Leaf size={48} color="var(--primary)" />
          <h2>{t('loginTitle')}</h2>
          <p>{t('loginSub')}</p>
        </div>

        <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="login-form">
          <div className="input-group">
            <label className="input-label">{t('phoneLabel')}</label>
            <input 
              type="tel" className="input-field" placeholder={t('phonePlaceholder')}
              value={phone} onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent} required
            />
          </div>

          {otpSent && (
            <div className="input-group" style={{marginTop: '1rem'}}>
              <label className="input-label">{t('otpLabel')}</label>
              <input 
                type="text" className="input-field" placeholder={t('otpPlaceholder')}
                value={otp} onChange={(e) => setOtp(e.target.value)}
                maxLength={4} required
              />
            </div>
          )}

          {error && <p style={{color: 'var(--danger)', fontSize: '.85rem', marginTop: '.5rem'}}>{error}</p>}

          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}} disabled={loading}>
            {loading ? '...' : otpSent ? t('verifyLogin') : t('getOtp')}
          </button>
        </form>

        <div className="login-lang-selector">
          <Globe size={16} />
          <select value={lang} onChange={e => setLang(e.target.value)}>
            {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Login;
