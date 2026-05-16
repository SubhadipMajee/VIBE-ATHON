import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useLang } from '../context/LangContext';

const YieldEstimator = ({ crop, regionWeatherData }) => {
  const { t } = useLang();
  const [acres, setAcres] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const a = parseFloat(acres); if(isNaN(a)||a<=0) return;
    const base = crop.profitPerAcre / 15;
    const avgR = Object.values(regionWeatherData).reduce((s,w)=>s+w.rainfall,0)/12;
    const rf = avgR>200?1.2:avgR<50?0.8:1.0;
    const yKg = base * rf * 0.95 * a;
    const yT = (yKg/1000).toFixed(1);
    const rev = (crop.profitPerAcre*a).toLocaleString();
    setResult(`${t('yieldSub').split('.')[0]}: ~${yT} tonnes. ₹${rev}.`);
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-title"><Calculator size={18} color="var(--primary)"/> {t('yieldTitle')}</div>
        <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>{t('yieldSub')}</p>
        <div className="input-group">
          <label className="input-label">{t('farmSize')}</label>
          <input type="number" className="input-field" placeholder="e.g. 2.5" value={acres} onChange={e=>setAcres(e.target.value)}/>
        </div>
        <button className="btn-primary" onClick={calc} disabled={!acres}>{t('calculate')}</button>
        {result && <div style={{marginTop:'1rem',padding:'1rem',background:'#E8F5E9',borderRadius:'8px',borderLeft:'4px solid var(--primary)',fontSize:'.95rem',lineHeight:'1.5'}}>{result}</div>}
      </div>
    </div>
  );
};
export default YieldEstimator;
