import React from 'react';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { MapPin, Globe, Heart, BellRing, Flame } from 'lucide-react';

interface HeaderProps {
  currentLang: 'en' | 'np';
  setLang: (lang: 'en' | 'np') => void;
  selectedDistrict: string;
  setSelectedDistrict: (dis: string) => void;
  onSosTrigger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  setLang,
  selectedDistrict,
  setSelectedDistrict,
  onSosTrigger
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  return (
    <header className="bg-emerald-900 text-stone-100 border-b border-emerald-800 shadow-md">
      {/* Topmost announcements / emergency alert strip */}
      <div className="bg-red-800 text-white text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 font-mono">
        <div className="flex items-center gap-2">
          <span className="bg-white text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
            LIVE CRISIS
          </span>
          <span>
            {currentLang === 'en' 
              ? 'Monsoon alert: Heavy rain in central hills. Drive carefully.' 
              : 'वर्षात चेतावनी: पहाडी भेगमा भारी वर्षाको सम्भावना। यात्रा गर्दा सतर्क रहनुहोला।'}
          </span>
        </div>
        <button 
          onClick={onSosTrigger}
          className="bg-stone-100 text-red-800 px-3 py-1 rounded text-[11px] font-bold hover:bg-stone-200 transition-all duration-200 flex items-center gap-1 shadow-sm uppercase shrink-0"
        >
          <Flame size={12} className="animate-bounce" />
          {t('sosButton')}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2.5 rounded-2xl text-emerald-900 shadow-inner flex-shrink-0">
              <Heart size={28} className="fill-red-500 stroke-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                  {t('appName')}
                </h1>
                {/* Visual tiny Nepal flag mockup */}
                <div className="flex flex-col items-start leading-[4px] border-l-2 border-red-500 pl-1.5 ml-1">
                  <span className="text-[10px] text-red-500 font-bold">▲</span>
                  <span className="text-[10px] text-red-500 font-bold">▲</span>
                </div>
              </div>
              <p className="text-emerald-200 text-xs sm:text-sm font-medium tracking-wide">
                ✨ {t('tagline')}
              </p>
            </div>
          </div>

          {/* Filtering and Actions Panel */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* District Selector */}
            <div className="flex items-center bg-emerald-950/75 px-3 py-2 rounded-xl border border-emerald-700/60 text-stone-200">
              <MapPin size={16} className="text-amber-400 mr-2" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest leading-none mb-0.5">
                  {t('districtLabel')}
                </span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent focus:outline-none text-xs sm:text-sm font-semibold cursor-pointer text-stone-100 py-0.5 pr-2"
                >
                  <option value="" className="bg-emerald-900 text-stone-100">
                    🌍 {t('allDistricts')}
                  </option>
                  {DISTRICTS.map((dis) => (
                    <option key={dis} value={dis} className="bg-emerald-900 text-stone-100">
                      🏔️ {dis}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(currentLang === 'en' ? 'np' : 'en')}
              className="bg-stone-100 hover:bg-stone-200 text-emerald-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition-all duration-200 flex items-center gap-1 ml-auto md:ml-0"
              title="Change Language"
            >
              <Globe size={16} className="text-emerald-700" />
              <span>{t('toggleLanguage')}</span>
            </button>

          </div>
        </div>

        {/* Informative Platform Motto Header Banner */}
        <div className="mt-5 bg-emerald-950/45 border border-emerald-800/40 rounded-xl p-3 flex items-center justify-between gap-4 text-xs">
          <p className="text-emerald-100/95 italic leading-relaxed sm:max-w-2xl">
            💡 <strong className="text-emerald-300 font-semibold">{t('empowering')}</strong>: {t('aboutPlatform')}
          </p>
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-300 font-mono text-[11px] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Nepal Core Local Time: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
