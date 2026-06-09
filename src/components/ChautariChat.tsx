import React, { useState } from 'react';
import { ChatMessage, EmergencyContact } from '../types';
import { TRANSLATIONS, DISTRICTS } from '../data';
import { MessageSquare, ShieldAlert, Phone, Send, AlertOctagon, Ambulance, Crosshair, BellRing, Volume2 } from 'lucide-react';

interface ChautariChatProps {
  currentLang: 'en' | 'np';
  chatMessages: ChatMessage[];
  emergencyContacts: EmergencyContact[];
  onSendMessage: (text: string, isSafety?: boolean) => void;
  selectedDistrict: string;
}

export const ChautariChat: React.FC<ChautariChatProps> = ({
  currentLang,
  chatMessages,
  emergencyContacts,
  onSendMessage,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  const [chatType, setChatType] = useState<'chat' | 'emergency'>('chat');
  const [userName, setUserName] = useState('');
  const [typedMessage, setTypedMessage] = useState('');

  // Emergency SOS customized values
  const [sosCategory, setSosCategory] = useState<'landslide' | 'flood' | 'accident' | 'fire'>('landslide');
  const [sosLocation, setSosLocation] = useState('');

  const handleMessageSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const prefixedUser = userName.trim() ? userName.trim() : (currentLang === 'en' ? 'Anonymous Neighbor' : 'अज्ञात छिमेकी');
    onSendMessage(`${prefixedUser}: ${typedMessage.trim()}`);
    setTypedMessage('');
  };

  const handleSosTransmit = () => {
    // Simulated siren sound using Web Audio API!
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1100, audioCtx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(650, audioCtx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio Context blocker by browser permissions.');
    }

    // Broadcast the distress alert!
    const categoryLabel = sosCategory.toUpperCase();
    const locationSuffix = sosLocation.trim() ? ` at ${sosLocation.trim()}` : '';
    const alertMessage = `🚨 RED SANKAT SOS: [${categoryLabel} EMERGENCY] requested in ${selectedDistrict || 'Nepal'}${locationSuffix}. Immediate response & assistance is vital! Please contact nearby sub-units.`;
    onSendMessage(alertMessage, true);
    setSosLocation('');
    alert(currentLang === 'en' ? 'SOS Alert Broadcasted to this District Feed successfully!' : 'तात्कालिक आपतकालीन सूचना यस क्षेत्रमा सफलतापुर्वक पठाउइयो!');
  };

  // Filter lists
  const filteredChat = chatMessages.filter(msg => !selectedDistrict || msg.district === selectedDistrict);
  const filteredEmergency = emergencyContacts.filter(cf => !selectedDistrict || cf.district === selectedDistrict);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 cols: Chat interface or Emergency SOS */}
      <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl p-5 shadow-sm min-h-[480px] flex flex-col justify-between">
        
        {/* Toggle Headings */}
        <div className="flex bg-stone-100 p-1 rounded-xl mb-4 gap-1">
          <button
            onClick={() => setChatType('chat')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              chatType === 'chat'
                ? 'bg-emerald-800 text-stone-100 shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MessageSquare size={15} />
            <span>💭 Chautari Live Feed ({selectedDistrict || 'Countrywide'})</span>
          </button>

          <button
            onClick={() => setChatType('emergency')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              chatType === 'emergency'
                ? 'bg-rose-800 text-white shadow-sm'
                : 'text-stone-605 hover:bg-stone-205 text-stone-600'
            }`}
          >
            <ShieldAlert size={15} />
            <span>🚨 {currentLang === 'en' ? 'Sankat SOS Room' : 'तात्कालिक आपतकालीन कोठा'}</span>
          </button>
        </div>

        {chatType === 'chat' ? (
          /* CHATROOM BOARD */
          <div className="flex-grow flex flex-col justify-between space-y-4">
            
            {/* Top prompt */}
            <div className="p-3 bg-stone-50 border border-stone-150 rounded-xl text-xs text-stone-600 flex items-center justify-between">
              <p>🏔️ {currentLang === 'en' 
                ? 'Discuss local conditions, road blockages, festive layout plans, or lost-found items in this district board.' 
                : 'बाटो बन्द भएको जानकारी, जलमग्न स्थानहरू वा स्थानीय पर्वहरूको बारेमा छिमेकीहरूसँग सिधा विमर्श गर्नुहोस्।'}
              </p>
              <div className="hidden sm:block text-[10px] text-emerald-850 uppercase font-mono tracking-widest bg-emerald-100/50 px-2.5 py-0.5 rounded font-bold">
                {selectedDistrict || 'ALL NEPAL'}
              </div>
            </div>

            {/* Message feed body */}
            <div className="flex-grow overflow-y-auto max-h-[300px] border border-stone-200/60 rounded-xl p-4 bg-stone-50/50 space-y-3.5">
              {filteredChat.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">
                  🍵 No messages in this feed yet. Say Namaste to start!
                </div>
              ) : (
                filteredChat.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed animate-in fade-in-35 ${
                      msg.isSafetyAlert
                        ? 'bg-red-100 text-red-950 border border-red-300 font-bold ml-0 animate-pulse'
                        : msg.sender === 'SYSTEM SAFETY BANNER'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 ml-0'
                        : 'bg-white border text-stone-800 ml-auto shadow-sm'
                    }`}
                  >
                    {!msg.isSafetyAlert && msg.sender !== 'SYSTEM SAFETY BANNER' && (
                      <div className="flex items-center justify-between mb-1 text-[10px] text-stone-400 font-semibold gap-4">
                        <span className="text-emerald-950 font-bold">👤 {msg.sender.split(':')[0]}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                    
                    <p className="whitespace-pre-line text-xs">
                      {msg.isSafetyAlert || msg.sender === 'SYSTEM SAFETY BANNER' ? msg.text : msg.text.substring(msg.text.indexOf(':') + 1)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={handleMessageSend} className="space-y-2.5">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder={currentLang === 'en' ? 'Your Name (Optional)' : 'तपाईको नाम (ऐच्छिक)'}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="col-span-1 border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-800 bg-white"
                />
                
                <input
                  type="text"
                  required
                  placeholder={currentLang === 'en' ? 'Type message to your neighbors...' : 'आफ्नो संदेश लेख्नुहोस्...'}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  className="col-span-2 border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-800 bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition shadow"
                >
                  <Send size={12} />
                  <span>{currentLang === 'en' ? 'Send to Chautari' : 'चौतारीमा पठाउनुहोस्'}</span>
                </button>
              </div>
            </form>

          </div>
        ) : (
          /* SANKAT SOS TRANSMITTER ROOM */
          <div className="space-y-4 flex-grow flex flex-col justify-between">
            
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-xs text-red-950 space-y-2.5">
              <h5 className="font-bold flex items-center gap-1 text-sm text-red-900">
                <AlertOctagon size={16} /> Broadcast Emergency Public SOS Alert
              </h5>
              <p>
                This form publishes an urgent, highlighted notice to ALL residents inside <strong className="font-bold underline">{selectedDistrict || 'this selected district'}</strong>. Use responsibly during flood risks, landslide washouts, or required group rescues.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emergency Niche Category:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSosCategory('landslide')}
                    className={`p-2.5 rounded-xl border font-bold ${sosCategory === 'landslide' ? 'bg-red-800 text-white border-red-900' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                  >
                    ⛰️ Landslide
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosCategory('flood')}
                    className={`p-2.5 rounded-xl border font-bold ${sosCategory === 'flood' ? 'bg-blue-800 text-white border-blue-900' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                  >
                    🌊 Flood Rise
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosCategory('accident')}
                    className={`p-2.5 rounded-xl border font-bold ${sosCategory === 'accident' ? 'bg-amber-700 text-white border-amber-800' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                  >
                    🩺 Medical Acc.
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosCategory('fire')}
                    className={`p-2.5 rounded-xl border font-bold ${sosCategory === 'fire' ? 'bg-orange-600 text-white border-orange-700' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                  >
                    🔥 Fire Break
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Landmark / Village Location:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward No 3 Slope, Main Highway roadblock"
                  value={sosLocation}
                  onChange={(e) => setSosLocation(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-red-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handleSosTransmit}
                className="w-full bg-red-800 hover:bg-red-950 text-white font-black text-xs sm:text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg tracking-wider transition-colors"
              >
                <Volume2 className="animate-bounce" size={18} />
                <span>🚨 {currentLang === 'en' ? 'TRANSMIT PUBLIC SOS WARNING' : 'आपतकालीन संकट चेतावनी प्रसारण गर्नुहोस्'}</span>
              </button>
              <p className="text-center text-[10px] text-stone-400 mt-2">
                Simulates sirens trigger. Everyone registered in this pocket district gets a loud visual marker.
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Right Column: Key District Directories & Live Contacts */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-black text-rose-950 text-sm uppercase tracking-wide flex items-center gap-1 border-b border-stone-250 pb-2.5">
          <Ambulance className="text-rose-700 font-bold" size={16} />
          {currentLang === 'en' ? 'Verified Sankat Contacts' : 'जिल्ला आकस्मिक टेलिफोन डाइरेक्टरी'}
        </h4>

        <p className="text-stone-500 text-xs">
          {currentLang === 'en'
            ? 'Emergency municipal bodies, Red Cross ambulance stations, and central blood directories verified for prompt reach.'
            : 'छनौट गरिएको जिल्लाका सरकारी अस्पताल, रेडक्रस एम्बुलेन्स सेवा र महत्वपूर्ण सम्पर्क नम्बरहरू।'}
        </p>

        {filteredEmergency.length === 0 ? (
          <div className="p-4 bg-stone-100 rounded-xl text-center text-stone-500 text-xs border border-dashed border-stone-300">
            😢 No local hotlines saved for this district. Displaying standard national hotlines:
            <div className="mt-3 space-y-1.5 font-bold text-rose-900 text-xs">
              <p>🚰 Police: 100</p>
              <p>🚒 Fire Emergency: 101</p>
              <p>🩺 Blood Bank: 01-4212344</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmergency.map((cf) => (
              <div key={cf.id} className="bg-white border border-stone-150 p-3 rounded-xl hover:shadow-sm transition space-y-1">
                <span className="text-[9px] uppercase font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">
                  {cf.category}
                </span>
                <p className="font-bold text-stone-900 text-xs">{cf.name}</p>
                <span className="text-[10px] text-stone-500 block">📍 Address: {cf.address}</span>

                <div className="pt-1.5 border-t border-stone-100/60 mt-1 flex items-center justify-between text-xs">
                  <a
                    href={`tel:${cf.phone.split('/')[0].trim()}`}
                    className="flex items-center gap-1 text-rose-800 font-extrabold hover:underline text-xs"
                  >
                    <Phone size={11} />
                    <span>{cf.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-stone-100/90 rounded-xl p-3 text-[11px] text-stone-500 border border-stone-200">
          📍 <strong className="font-semibold">Sub-branch updates:</strong> If you represent a local Red Cross or healthcare ambulance center in your rural village, submit details to your nearest Ward Secretary.
        </div>

      </div>

    </div>
  );
};
