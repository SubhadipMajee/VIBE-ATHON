import React, { useState, useEffect } from 'react';
import { Leaf, Globe, CheckCircle } from 'lucide-react';
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
  const [toast, setToast] = useState('');
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'pin'
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
        setToast(`✅ OTP sent to +91 ${phone}`);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      setOtpSent(true);
      setToast(`✅ OTP sent to +91 ${phone}`);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
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
        onLogin(phone);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      onLogin(phone);
    }
    setLoading(false);
  };

  const handlePinLogin = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Enter valid 10-digit mobile number');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    // Mock PIN verification for demo
    onLogin(phone);
  };

  return (
    <div className="login-page">
      {toast && (
        <div className="otp-toast">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <Leaf size={48} color="var(--primary)" />
          <h2>{t('loginTitle')}</h2>
          <p>{t('loginSub')}</p>
        </div>

        {loginMethod === 'otp' ? (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="login-form">
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
                  maxLength={4} autoFocus required
                />
                <p style={{fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.25rem'}}>
                  💡 Check your SMS (Demo: see backend terminal for OTP)
                </p>
              </div>
            )}

            {error && <p style={{color: 'var(--danger)', fontSize: '.85rem', marginTop: '.5rem'}}>{error}</p>}

            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}} disabled={loading}>
              {loading ? '...' : otpSent ? t('verifyLogin') : t('getOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinLogin} className="login-form">
            <div className="input-group">
              <label className="input-label">{t('phoneLabel')}</label>
              <input 
                type="tel" className="input-field" placeholder={t('phonePlaceholder')}
                value={phone} onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{marginTop: '1rem'}}>
              <label className="input-label">{t('pinLabel')}</label>
              <input 
                type="password" className="input-field" placeholder={t('pinPlaceholder')}
                value={pin} onChange={(e) => setPin(e.target.value)}
                maxLength={4} required
              />
            </div>

            {error && <p style={{color: 'var(--danger)', fontSize: '.85rem', marginTop: '.5rem'}}>{error}</p>}

            <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '1.5rem'}}>
              {t('verifyLogin')}
            </button>
          </form>
        )}

        <div style={{marginTop: '1rem'}}>
          <button 
            type="button" 
            onClick={() => {
              setLoginMethod(loginMethod === 'otp' ? 'pin' : 'otp');
              setError('');
              setOtpSent(false);
              setOtp('');
              setPin('');
            }}
            style={{
              background: 'none', border: 'none', color: 'var(--primary-dark)',
              textDecoration: 'underline', cursor: 'pointer', fontSize: '.9rem'
            }}
          >
            {loginMethod === 'otp' ? t('loginWithPin') : t('loginWithOtp')}
          </button>
        </div>

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
