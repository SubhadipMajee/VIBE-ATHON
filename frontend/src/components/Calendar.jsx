import React from 'react';
import { useLang } from '../context/LangContext';

const Calendar = ({ crop, selectedMonth, onMonthSelect, regionWeatherData }) => {
  const { t } = useLang();
  return (
    <div className="main-content">
      <h3 style={{marginBottom:'.5rem',fontSize:'1.1rem'}}>{t('annualPlan')}: {crop.name}</h3>
      <div className="calendar-grid">
        {Object.entries(crop.activities).map(([m, act]) => {
          const weather = regionWeatherData[m];
          return (
            <div key={m} className={`calendar-card ${m===selectedMonth?'selected':''}`} onClick={()=>onMonthSelect(m)}>
              <div className="cal-month">{m}</div>
              <div className="cal-icon">{act.icon}</div>
              <div className="cal-activity">{t(act.type)||act.label}</div>
              <div className="cal-stats">{weather.temp}°C | {weather.rainfall}mm</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Calendar;
