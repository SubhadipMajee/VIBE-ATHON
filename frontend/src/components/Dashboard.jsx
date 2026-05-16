import React from 'react';
import { AlertTriangle, Thermometer, CloudRain, Info } from 'lucide-react';
import { getFieldAdvice } from '../api/claude';
import { useLang } from '../context/LangContext';

const Dashboard = ({ region, crop, month, currentActivity, weather }) => {
  const { t } = useLang();
  const [aiAdvice, setAiAdvice] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const advice = await getFieldAdvice({ region: region.name, crop: crop.name, month, activity: currentActivity.label, temp: weather.temp, rainfall: weather.rainfall });
    setAiAdvice(advice);
    setLoading(false);
  };

  const getRainBadge = (r) => {
    if (r < 50) return { label: 'Dry', cls: 'dry' };
    if (r < 100) return { label: 'Light', cls: 'light' };
    if (r < 200) return { label: 'Moderate', cls: 'moderate' };
    return { label: 'Heavy', cls: 'heavy' };
  };
  const rb = getRainBadge(weather.rainfall);

  const activityLabel = t(currentActivity.type) || currentActivity.label;

  const generateSmartAlert = () => {
    const r = weather.rainfall;
    const t = weather.temp;
    const type = currentActivity.type;

    if (r > 150 && type === 'harvest') return { msg: 'Warning: Harvesting during heavy rain causes crop rot. Try to harvest early or ensure dry storage.', type: 'danger' };
    if (r > 100 && type === 'prep') return { msg: 'Warning: Heavy rainfall will wash away fertilizers. Delay application until rain subsides.', type: 'danger' };
    if (t > 34 && type === 'sowing') return { msg: 'Warning: High heat can dry out seeds. Ensure deep irrigation before sowing.', type: 'danger' };
    if (r < 20 && type === 'irrigate') return { msg: 'Warning: Severe dry spell expected. Increase irrigation frequency to prevent crop stress.', type: 'warning' };
    if (t < 15 && type === 'harvest') return { msg: 'Warning: Low temperatures may delay grain drying. Plan harvesting accordingly.', type: 'warning' };
    
    // Fallback to basic weather alerts if no specific activity conflict
    if (r > 250) return { msg: 'Alert: Extremely heavy rainfall expected this month. Monitor fields for waterlogging.', type: 'danger' };
    if (t > 36) return { msg: 'Alert: Severe heatwave conditions. Ensure adequate hydration for crops.', type: 'danger' };

    return null;
  };

  const smartAlert = generateSmartAlert();

  return (
    <div className="main-content">
      {smartAlert && (
        <div className={`alert-box ${smartAlert.type === 'danger' ? 'danger' : ''}`}>
          <AlertTriangle className="alert-icon" size={22}/>
          <div className="alert-content">
            <h4 className="alert-title">{smartAlert.type === 'danger' ? 'Critical Warning' : 'Weather Alert'}</h4>
            <p>{smartAlert.msg}</p>
          </div>
        </div>
      )}
      <div className="grid-2">
        <div className="card">
          <div className="card-title"><span>{currentActivity.icon}</span> {t('currentActivity')}</div>
          <div className="card-value" style={{color:'var(--text)'}}>{activityLabel}</div>
        </div>
        <div className="card">
          <div className="card-title"><Thermometer size={18} color="var(--primary)"/> {t('avgTemp')}</div>
          <div className="card-value">{weather.temp}°C</div>
        </div>
      </div>
      <div className="card">
        <div className="card-title" style={{display:'flex',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.5rem'}}><CloudRain size={18} color="#0288D1"/> {t('monthlyRainfall')}</div>
          <span className={`badge ${rb.cls}`}>{rb.label}</span>
        </div>
        <div className="card-value">{weather.rainfall} mm</div>
      </div>
      <div className="card">
        <div className="card-title">{t('annualPlan')}</div>
        <div className="timeline">
          {Object.entries(crop.activities).map(([m, act]) => (
            <div key={m} className={`timeline-segment bg-${act.type}`} title={`${m}: ${act.label}`} style={{border: m===month?'2px solid black':'none'}}>{act.icon}</div>
          ))}
        </div>
        <div className="timeline-labels">
          <div className="timeline-label">Jan</div><div className="timeline-label">Mar</div><div className="timeline-label">Jun</div><div className="timeline-label">Sep</div><div className="timeline-label">Dec</div>
        </div>
      </div>
      <div className="card" style={{background:'#E8F5E9',border:'1px solid var(--primary)'}}>
        <div className="card-title" style={{color:'var(--primary-dark)'}}><Info size={18}/> {t('fieldAdvisor')}</div>
        {aiAdvice ? (
          <p style={{fontSize:'.9rem',lineHeight:'1.5',marginTop:'.5rem'}}>{aiAdvice}</p>
        ) : (
          <button className="btn-primary" onClick={handleGetAdvice} disabled={loading} style={{marginTop:'.5rem'}}>
            {loading ? t('analyzing') : t('getAdvice')}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
