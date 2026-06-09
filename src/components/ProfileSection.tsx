import React, { useState } from 'react';
import { ServiceProvider, MarketItem } from '../types';
import { TRANSLATIONS } from '../data';
import { 
  User, 
  MapPin, 
  Award, 
  Settings, 
  Plus, 
  X, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  ShoppingBag, 
  Trash2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProfileSectionProps {
  currentLang: 'en' | 'np';
  activeMarketplaceListings: MarketItem[];
  registeredServices: ServiceProvider[];
  onDeleteListing: (id: string) => void;
  selectedDistrict: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentLang,
  activeMarketplaceListings,
  registeredServices,
  onDeleteListing,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Editable Profile States
  const [profileName, setProfileName] = useState('Anish Adhikari');
  const [profileBio, setProfileBio] = useState('Passionate organic orange grower from Pokhara Ward 5. Willing to help on community logistics, heavy truck pilot support, and first aid volunteering.');
  const [profileWard, setProfileWard] = useState('Ward No. 5, Chipledhunga');
  const [profilePhone, setProfilePhone] = useState('9851082103');
  const [isEditing, setIsEditing] = useState(false);

  // Skills chips state management
  const [skills, setSkills] = useState<string[]>(['Agriculture Specialist', 'Truck Pilot', 'First Aid Responder', 'High-Altitude Guide']);
  const [newSkill, setNewSkill] = useState('');

  const [participationLog] = useState([
    { task: 'Provided O-ve Blood for Critical help request in Bir Hospital', date: 'Yesterday' },
    { task: 'Polled in Council Ward 4 Road Maintenance debate', date: '3 days ago' },
    { task: 'Added helpful review for plumber Ram Bahadur', date: '1 week ago' },
  ]);

  const handleApplyProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Main Profile Card & Verification badges */}
      <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-emerald-900 text-stone-100 text-xs font-bold px-4 py-1.5 rounded-bl-3xl flex items-center gap-1">
          <ShieldCheck size={13} className="text-amber-400" />
          <span>Verified Citizen Account</span>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white font-display font-black text-2xl flex items-center justify-center shrink-0 border-4 border-stone-105 shadow-inner">
            {profileName.charAt(0)}
          </div>

          <div className="flex-grow space-y-3 text-center md:text-left">
            {!isEditing ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="font-display font-black text-stone-90c text-xl sm:text-2xl">{profileName}</h3>
                  <span className="bg-emerald-50 text-emerald-900 font-bold font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                    <CheckCircle2 size={10} className="fill-emerald-800 text-white" />
                    Chautari Elder
                  </span>
                </div>

                <p className="text-xs text-stone-500 font-medium flex items-center justify-center md:justify-start gap-1">
                  <MapPin size={13} className="text-red-500" />
                  <span>📍 {profileWard}, {selectedDistrict || 'Kaski'} District</span>
                </p>

                <p className="text-stone-650 text-xs sm:text-sm leading-relaxed max-w-2xl mt-2">{profileBio}</p>
                <p className="text-[11px] text-stone-400 font-mono pt-1">📱 Security hotline: {profilePhone}</p>
              </div>
            ) : (
              <form onSubmit={handleApplyProfileEdit} className="space-y-4 text-xs text-left max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Name:</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required className="w-full text-xs p-2 border rounded-md bg-stone-50" />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Hotline Mobile:</label>
                    <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required className="w-full text-xs p-2 border rounded-md bg-stone-50" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-0.5">District Area / Ward No. address:</label>
                  <input type="text" value={profileWard} onChange={(e) => setProfileWard(e.target.value)} required className="w-full text-xs p-2 border rounded-md bg-stone-50" />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-0.5">Short Bio narrative (Offer mutual aid details):</label>
                  <textarea rows={2} value={profileBio} onChange={(e) => setProfileBio(e.target.value)} required className="w-full text-xs p-2 border rounded-md bg-stone-50 focus:outline-none" />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-emerald-800 text-white font-bold px-4 py-1.5 rounded-lg shadow">Apply Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg">Cancel</button>
                </div>
              </form>
            )}

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-stone-105 hover:bg-stone-200 text-stone-750 font-bold text-xs px-3.5 py-1.5 rounded-xl border flex items-center gap-1 shadow-xs transition"
              >
                <Settings size={12} />
                <span>Edit Profile Settings</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Main bento split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 segments: reputation and skills */}
        <div className="md:col-span-2 space-y-8">
          
          {/* REPUTATION AND TRUST SCORE */}
          <div className="bg-gradient-to-br from-stone-50 to-emerald-50/20 border border-stone-200 rounded-3xl p-6 space-y-4">
            <h4 className="font-display font-black text-stone-90c text-sm uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Award size={16} className="text-amber-500" />
              <span>Civic Reputation Matrix</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">Reputation Index</p>
                <p className="font-display font-black text-emerald-900 text-3xl sm:text-4xl">98%</p>
                <p className="text-[10px] text-stone-500 font-semibold italic">98 out of 100 neighbors endorsed</p>
              </div>

              <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-stone-200/60 py-3 sm:py-0 sm:px-6">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">Emergency Karma</p>
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Heart className="text-red-700 fill-red-700" size={16} />
                  <span className="font-display font-black text-stone-900 text-xl sm:text-2xl">Elite Hero</span>
                </div>
                <p className="text-[10px] text-stone-505">Responded to 4 active SOS</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-none">Total Participation Score</p>
                <p className="font-display font-black text-amber-900 text-xl sm:text-2xl">1,240 pts</p>
                <span className="inline-block bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 rounded-full font-mono">
                  Rank #14 Pokhara
                </span>
              </div>
            </div>
          </div>

          {/* EDITABLE SKILLS CHIPS COLLECTION */}
          <div className="bg-white border rounded-3xl p-6 space-y-4">
            <h4 className="font-display font-black text-stone-90c text-sm uppercase tracking-wide">
              🛠️ Skills & Certifications Directory
            </h4>
            <p className="text-xs text-stone-505 leading-relaxed">
              Add your manual capacities (e.g., PLUMBER, NURSE, VEGETABLE PACKER) so neighbors can discover or hire you during regional activities or emergencies.
            </p>

            {/* List skills */}
            <div className="flex flex-wrap gap-2 pt-1 border-b pb-4">
              {skills.length === 0 ? (
                <span className="text-xs text-stone-400 italic">No skills added yet. Let neighbors know what you can do!</span>
              ) : (
                skills.map(s => (
                  <span 
                    key={s} 
                    className="text-xs font-bold text-emerald-950 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-red-50 hover:text-red-950 hover:border-red-200 transition-colors group cursor-pointer"
                    title="Click X to delete skill"
                    onClick={() => handleRemoveSkill(s)}
                  >
                    <span>{s}</span>
                    <X size={10} className="text-stone-400 group-hover:text-red-900" />
                  </span>
                ))
              )}
            </div>

            {/* Form addition */}
            <form onSubmit={handleAddSkill} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Add other skill (e.g. Electrician, Translator, Plumber)..."
                required
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-grow p-2.5 border rounded-xl bg-stone-50 focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
              <button
                type="submit"
                className="bg-emerald-900 text-white font-bold p-3 rounded-xl flex items-center justify-center shrink-0 hover:bg-emerald-950 transition"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>

          {/* REGISTERED SERVICES OFFERED */}
          <div className="bg-white border rounded-3xl p-6 space-y-4">
            <h4 className="font-display font-black text-stone-900 text-sm uppercase tracking-wide">
              📢 Registered Services Listing
            </h4>
            {registeredServices.length === 0 ? (
              <div className="p-5 bg-stone-50 border border-dashed rounded-2xl text-xs text-stone-400 text-center">
                Currently, you are not registered as an active Service Provider. Visit the <strong className="font-bold underline">Services</strong> tab to list your public specialties.
              </div>
            ) : (
              <div className="space-y-3">
                {registeredServices.map(prov => (
                  <div key={prov.id} className="bg-stone-50 border p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-emerald-900 bg-emerald-100 px-2 rounded">
                        {prov.category}
                      </span>
                      <h5 className="font-bold text-stone-900 text-xs mt-1">{prov.name}</h5>
                      <p className="text-[10px] text-stone-400">Rate: {prov.cost} • 📍 District: {prov.district}</p>
                    </div>

                    <span className="text-xs text-stone-400 font-mono">⚠️ Read-only in profile</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 col: participations logs and marketplace listings and delete */}
        <div className="space-y-8">
          
          {/* COMMUNITY PARTICIPATION STATS & RECENT LOGS */}
          <div className="bg-white border rounded-3xl p-5 space-y-4">
            <h4 className="font-display font-black text-stone-900 text-sm uppercase tracking-wider flex items-center gap-1 border-b pb-2">
              <Sparkles size={15} className="text-amber-500 fill-amber-500" />
              <span>Chautari Action Log</span>
            </h4>
            <div className="space-y-3 text-xs">
              {participationLog.map((log, i) => (
                <div key={i} className="border-b border-stone-100 pb-2.5 space-y-1">
                  <p className="font-medium text-stone-800 leading-snug">{log.task}</p>
                  <p className="text-[9px] text-stone-400 font-mono">{log.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* THEIR PERSONAL MARKETPLACE LISTINGS with active delete */}
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-3xl space-y-4">
            <h4 className="font-display font-black text-stone-950 text-sm uppercase tracking-wide flex items-center justify-between border-b pb-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag size={15} className="text-emerald-800" />
                Your Market Ads
              </span>
              <span className="font-mono text-stone-500 text-xs">({activeMarketplaceListings.length})</span>
            </h4>

            {activeMarketplaceListings.length === 0 ? (
              <p className="text-stone-400 text-xs text-center py-6 italic">You have no active sale postings listed.</p>
            ) : (
              <div className="space-y-3">
                {activeMarketplaceListings.map(lst => (
                  <div key={lst.id} className="bg-white p-3 rounded-2xl border border-stone-205 shadow-xs flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 text-xs truncate">{lst.title}</p>
                      <p className="text-[10px] text-emerald-900 font-black mt-0.5">{lst.price}</p>
                    </div>

                    <button
                      onClick={() => onDeleteListing(lst.id)}
                      className="text-red-700 hover:bg-rose-50 p-2 rounded-lg transition"
                      title="Delete Listing permanently"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
