import React from 'react';
import { govtSchemes } from '../data/schemes';
import { Landmark } from 'lucide-react';
import { useLang } from '../context/LangContext';

const GovtSchemes = () => {
  const { t } = useLang();
  return (
    <div className="main-content">
      <h3 style={{marginBottom:'.5rem',fontSize:'1.1rem',display:'flex',alignItems:'center',gap:'.5rem'}}>
        <Landmark size={20} color="var(--primary)"/> {t('schemesTitle')}
      </h3>
      <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>{t('schemesSub')}</p>
      {govtSchemes.map(s=>(
        <div key={s.id} className="card" style={{marginBottom:'1rem'}}>
          <div className="card-title" style={{color:'var(--primary-dark)'}}>{s.name}</div>
          <p style={{fontSize:'.9rem',marginBottom:'.75rem'}}>{s.description}</p>
          <div style={{background:'#f5f5f5',padding:'.75rem',borderRadius:'8px',marginBottom:'.75rem'}}>
            <div style={{fontSize:'.85rem',marginBottom:'.25rem'}}><strong>{t('benefit')}:</strong> <span style={{color:'var(--primary)'}}>{s.benefit}</span></div>
            <div style={{fontSize:'.85rem'}}><strong>{t('eligibility')}:</strong> {s.eligibility}</div>
          </div>
          <a href={s.applyLink} target="_blank" rel="noreferrer" className="btn-primary" style={{textDecoration:'none',display:'block',textAlign:'center'}}>{t('apply')}</a>
        </div>
      ))}
    </div>
  );
};
export default GovtSchemes;
