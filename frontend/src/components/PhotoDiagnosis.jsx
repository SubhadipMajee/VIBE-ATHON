import React, { useState, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { diagnosePlant } from '../api/claude';
import { useLang } from '../context/LangContext';

const PhotoDiagnosis = ({ context }) => {
  const { t } = useLang();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const fileRef = useRef(null);

  const onUpload = (e) => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onloadend=()=>{setImage(r.result);setDiagnosis(null)};r.readAsDataURL(f);} };
  const onDiagnose = async () => { if(!image)return; setLoading(true); try{setDiagnosis(await diagnosePlant(image,context))}finally{setLoading(false)} };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-title">{t('plantDiagnosis')}</div>
        <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>{t('diagnosisSub')}</p>
        {image ? (
          <div>
            <img src={image} alt="Plant" className="image-preview"/>
            <div style={{display:'flex',gap:'.5rem',marginBottom:'1rem'}}>
              <button className="btn-primary" style={{background:'var(--text-muted)',flex:1}} onClick={()=>{setImage(null);setDiagnosis(null)}} disabled={loading}>{t('retake')}</button>
              <button className="btn-primary" style={{flex:2}} onClick={onDiagnose} disabled={loading||diagnosis}>{loading?t('analyzingImg'):t('diagnose')}</button>
            </div>
          </div>
        ) : (
          <div style={{border:'2px dashed var(--border)',borderRadius:'8px',padding:'2rem',textAlign:'center',cursor:'pointer',background:'#fafafa'}} onClick={()=>fileRef.current?.click()}>
            <Camera size={48} color="var(--text-muted)" style={{margin:'0 auto 1rem'}}/>
            <h4 style={{marginBottom:'.5rem'}}>{t('takePhoto')}</h4>
            <p style={{fontSize:'.8rem',color:'var(--text-muted)'}}>{t('photoHint')}</p>
          </div>
        )}
        <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={onUpload} className="hidden-input"/>
      </div>
      {diagnosis && (
        <div className="diagnosis-result">
          <h3><AlertCircle color={diagnosis.severity==='High'?'var(--danger)':'var(--warning)'}/> {diagnosis.name}</h3>
          <div className="diagnosis-section"><strong>{t('severity')}</strong><span style={{color:diagnosis.severity==='High'?'var(--danger)':'var(--warning)',fontWeight:600}}>{diagnosis.severity}</span></div>
          <div className="diagnosis-section"><strong>{t('cause')}</strong><p>{diagnosis.cause}</p></div>
          <div className="diagnosis-section"><strong>{t('treatment')}</strong><p style={{color:'var(--primary-dark)',fontWeight:500}}>{diagnosis.treatment}</p></div>
          <div className="diagnosis-section"><strong>{t('prevention')}</strong><p>{diagnosis.prevention}</p></div>
        </div>
      )}
    </div>
  );
};
export default PhotoDiagnosis;
