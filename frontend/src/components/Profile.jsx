import React from 'react';
import { User, MapPin, Phone, Settings, LogOut, Sprout } from 'lucide-react';
import { useLang } from '../context/LangContext';

const Profile = ({ onLogout }) => {
  const { t, lang } = useLang();

  // Mock user data
  const user = {
    name: 'Ramesh Kumar',
    phone: '+91 9876543210',
    landSize: '2.5 Acres',
    joined: 'Jan 2024',
    primaryCrop: 'Rice, Wheat'
  };

  const handleLogout = () => {
    localStorage.removeItem('kisanai_token');
    if (onLogout) onLogout();
    window.location.reload();
  };

  return (
    <div className="main-content">
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', background: '#E8F5E9',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
        }}>
          <User size={40} color="var(--primary)" />
        </div>
        <h2 style={{ marginBottom: '.5rem', color: 'var(--primary-dark)' }}>{user.name}</h2>
        <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
          <Phone size={14} /> {user.phone}
        </p>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><Sprout size={18} color="var(--primary)" /> {t('farmDetails') || 'Farm Details'}</div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Land Size</div>
              <div style={{ fontWeight: '500' }}>{user.landSize}</div>
            </div>
            <div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Primary Crops</div>
              <div style={{ fontWeight: '500' }}>{user.primaryCrop}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><Settings size={18} color="var(--primary)" /> {t('accountSettings') || 'Account Settings'}</div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>App Language</div>
              <div style={{ fontWeight: '500', textTransform: 'uppercase' }}>{lang}</div>
            </div>
            <div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>Member Since</div>
              <div style={{ fontWeight: '500' }}>{user.joined}</div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{
          width: '100%', marginTop: '1.5rem', padding: '1rem',
          background: '#fee2e2', color: '#dc2626', border: '1px solid #f87171',
          borderRadius: 'var(--r-md)', fontWeight: 'bold', fontSize: '1rem',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem'
        }}
      >
        <LogOut size={18} /> {t('logout') || 'Logout'}
      </button>
    </div>
  );
};

export default Profile;
