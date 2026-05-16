import React, { useState } from 'react';
import { Leaf, LayoutDashboard, CalendarDays, MessageSquare, Camera, Calculator, GitCompare, Landmark, Menu, X, MapPin, Wheat, Calendar, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/Calendar';
import CropCompare from './components/CropCompare';
import KisanChat from './components/KisanChat';
import PhotoDiagnosis from './components/PhotoDiagnosis';
import YieldEstimator from './components/YieldEstimator';
import GovtSchemes from './components/GovtSchemes';
import Login from './components/Login';
import { LangProvider, useLang } from './context/LangContext';
import { languages } from './data/translations';
import { cropsData, cropsList } from './data/crops';
import { regionsData, weatherData, monthsList } from './data/regions';

function AppInner() {
  const { lang, setLang, t } = useLang();
  const [regionId, setRegionId] = useState('wb');
  const [cropId, setCropId] = useState('rice');
  const currentMonthIndex = new Date().getMonth();
  const [month, setMonth] = useState(monthsList[currentMonthIndex]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  const selectedCrop = cropsData.find(c => c.id === cropId);
  const selectedRegion = regionsData.find(r => r.id === regionId);
  const regionWeather = weatherData[regionId];
  const currentMonthWeather = regionWeather[month];
  const currentActivity = selectedCrop.activities[month];
  const context = { region: selectedRegion.name, crop: selectedCrop.name, month, activity: currentActivity.label };

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'chat', label: t('aiChat'), icon: MessageSquare },
    { id: 'diagnosis', label: t('diagnosis'), icon: Camera },
    { id: 'yield', label: t('yieldEst'), icon: Calculator },
    { id: 'compare', label: t('compareCrops'), icon: GitCompare },
    { id: 'schemes', label: t('govtSchemes'), icon: Landmark },
  ];

  const handleNav = (id) => { setActiveTab(id); setSidebarOpen(false); };

  return (
    <>
      <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1><Leaf size={22} /> {t('appName')}</h1>
          <p>{t('appSub')}</p>
        </div>
        <div className="sidebar-selectors">
          <label><Globe size={12} style={{marginRight:4,verticalAlign:'middle'}}/>{t('language')}</label>
          <select className="selector" value={lang} onChange={e => setLang(e.target.value)}>
            {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <label>{t('region')}</label>
          <button className="selector" style={{textAlign:'left', cursor:'pointer'}} onClick={() => setShowRegionModal(true)}>
            <MapPin size={14} style={{verticalAlign:'middle', marginRight:'6px'}}/>
            {selectedRegion.name}
          </button>
          <label>{t('crop')}</label>
          <select className="selector" value={cropId} onChange={e => setCropId(e.target.value)}>
            {cropsList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label>{t('month')}</label>
          <select className="selector" value={month} onChange={e => setMonth(e.target.value)}>
            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => handleNav(tab.id)}>
                <Icon size={18} /> {tab.label}
              </div>
            );
          })}
        </nav>
      </aside>
      <div className="page-container">
        <header className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
            <span className="topbar-title">{tabs.find(tb=>tb.id===activeTab)?.label}</span>
          </div>
          <div className="topbar-ctx">
            <span><MapPin size={14}/> {selectedRegion.name}</span>
            <span><Wheat size={14}/> {selectedCrop.name}</span>
            <span><Calendar size={14}/> {month}</span>
          </div>
        </header>
        {activeTab==='dashboard' && <Dashboard region={selectedRegion} crop={selectedCrop} month={month} currentActivity={currentActivity} weather={currentMonthWeather}/>}
        {activeTab==='calendar' && <CalendarView crop={selectedCrop} selectedMonth={month} onMonthSelect={m=>{setMonth(m);setActiveTab('dashboard')}} regionWeatherData={regionWeather}/>}
        {activeTab==='compare' && <CropCompare selectedCrop={selectedCrop} onCropSelect={id=>{setCropId(id);setActiveTab('dashboard')}}/>}
        {activeTab==='chat' && <KisanChat context={context}/>}
        {activeTab==='diagnosis' && <PhotoDiagnosis context={context}/>}
        {activeTab==='yield' && <YieldEstimator crop={selectedCrop} regionWeatherData={regionWeather}/>}
        {activeTab==='schemes' && <GovtSchemes/>}
      </div>

      {showRegionModal && (
        <div className="modal-overlay" onClick={() => setShowRegionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('region') || 'Select Region'}</h3>
              <button className="close-btn" onClick={() => setShowRegionModal(false)}><X size={20}/></button>
            </div>
            <div className="region-grid">
              {regionsData.map(r => (
                <div 
                  key={r.id} 
                  className={`region-card ${r.id === regionId ? 'active' : ''}`}
                  onClick={() => { setRegionId(r.id); setShowRegionModal(false); }}
                >
                  <MapPin size={24} color={r.id === regionId ? 'var(--primary)' : '#666'} />
                  <h4>{r.name}</h4>
                  <p style={{fontSize:'.8rem', color:'#666', marginTop:'4px'}}>
                    {weatherData[r.id][month].temp}°C | {weatherData[r.id][month].rainfall}mm rain
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AppInner />;
}

export default function App() {
  return (
    <LangProvider>
      <MainApp />
    </LangProvider>
  );
}
