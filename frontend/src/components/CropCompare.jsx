import React from 'react';
import { cropsData } from '../data/crops';
import { useLang } from '../context/LangContext';

const CropCompare = ({ selectedCrop, onCropSelect }) => {
  const { t } = useLang();
  return (
    <div className="main-content">
      <h3 style={{marginBottom:'.5rem',fontSize:'1.1rem'}}>{t('compareCropsTitle')}</h3>
      <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>{t('compareCropsSub')}</p>
      <div className="table-container">
        <table className="table">
          <thead><tr><th>{t('crop')}</th><th>{t('water')}</th><th>{t('profitAcre')}</th><th>{t('season')}</th></tr></thead>
          <tbody>
            {cropsData.map(c=>(
              <tr key={c.id} className={selectedCrop.id===c.id?'active-row':''} onClick={()=>onCropSelect(c.id)}>
                <td style={{fontWeight:500}}>{c.name}</td>
                <td><span style={{color:c.waterReq==='High'||c.waterReq==='Very High'?'var(--danger)':c.waterReq==='Medium'?'var(--warning)':'var(--primary)'}}>{c.waterReq}</span></td>
                <td>₹{c.profitPerAcre.toLocaleString()}</td>
                <td>{c.seasonFit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CropCompare;
