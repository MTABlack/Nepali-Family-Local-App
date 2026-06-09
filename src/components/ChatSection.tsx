import React, { useState, useRef } from 'react';
import { ChatMessage } from '../types';
import { TRANSLATIONS } from '../data';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Paperclip, 
  File, 
  Image, 
  Volume2, 
  Play, 
  Pause,
  AlertTriangle,
  User, 
  Users, 
  Globe, 
  X,
  Plus
} from 'lucide-react';

interface ChatSectionProps {
  currentLang: 'en' | 'np';
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, isSafety?: boolean) => void;
  selectedDistrict: string;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  currentLang,
  chatMessages,
  onSendMessage,
  selectedDistrict
}) => {
  const t = (key: string) => TRANSLATIONS[key]?.[currentLang] || key;

  // Active sub-room state
  const [chatType, setChatType] = useState<'private' | 'group' | 'community'>('community');

  // Input fields state
  const [typedMessage, setTypedMessage] = useState('');
  const [userName, setUserName] = useState('');

  // Selected private handler
  const [selectedUser, setSelectedUser] = useState<string>('Pema Sherpa');

  // Selected group handler
  const [selectedGroup, setSelectedGroup] = useState<string>('Ward No. 3 Vigilance Team');

  // VOICE MESSAGE SIMULATOR STATE
  const [isRecording, setIsRecording] = useState(false);
  const [recordedClips, setRecordedClips] = useState<Array<{ id: string; duration: string; timestamp: string }>>([]);
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const recordingTimer = useRef<number | null>(null);
  const [recordDuration, setRecordDuration] = useState(0);

  // FILE ATTACHMENTS STATE
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive private handler directories
  const PRIVATE_CONTACTS = [
    { name: 'Pema Sherpa', title: 'Everest Homestay Guide', active: true },
    { name: 'Dr. Rabin Bhatta', title: 'Blood Coordinator', active: false },
    { name: 'Maya KC', title: 'Local Tailoring Lead', active: true },
    { name: 'Sagar Adhikari', title: 'Electrician Inspector', active: false }
  ];

  const GROUPS_DIRECTORIES = [
    { name: 'Ward No. 3 Vigilance Team', count: 14, text: '討論 10:00 PM गस्ती कार्यतालिका' },
    { name: 'Chitwan Organic Farm Club', count: 48, text: 'مکै रोग नियन्त्रण बैठक विवरण' },
    { name: 'Blood Group O-ve Volunteers', count: 21, text: 'Emergency Blood donors standby list' }
  ];

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    recordingTimer.current = window.setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    setIsRecording(false);
    
    // Publish mock voice message
    const formattedDuration = `${Math.floor(recordDuration / 60)}:${(recordDuration % 60).toString().padStart(2, '0')}`;
    const nameStr = userName.trim() ? userName.trim() : (currentLang === 'en' ? 'Neighbor' : 'छिमेकी');
    
    // Send message simulating voice note
    onSendMessage(`${nameStr}: [🎤 Voice Note - ${formattedDuration || '0:05'}]`);
    setRecordDuration(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: any[] = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push({
        name: files[i].name,
        size: `${(files[i].size / 1024).toFixed(1)} KB`,
        type: files[i].type
      });
    }

    setAttachedFiles([...attachedFiles, ...fileList]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSendFullMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && attachedFiles.length === 0) return;

    const nameStr = userName.trim() ? userName.trim() : (currentLang === 'en' ? 'Neighbor' : 'छिमेकी');
    
    let compileText = '';
    if (typedMessage.trim()) {
      compileText += typedMessage.trim();
    }

    if (attachedFiles.length > 0) {
      const attachmentsSummary = attachedFiles.map(f => `📎 [Attachment: ${f.name} (${f.size})]`).join(' ');
      compileText += (compileText ? ' ' : '') + attachmentsSummary;
    }

    // Dispatch message
    onSendMessage(`${nameStr}: ${compileText}`);
    setTypedMessage('');
    setAttachedFiles([]);
  };

  // Simulating playback trigger
  const playPauseAudio = (id: string) => {
    if (playingClipId === id) {
      setPlayingClipId(null);
    } else {
      setPlayingClipId(id);
      // Simulate stopping after few seconds
      setTimeout(() => {
        setPlayingClipId(null);
      }, 4000);
    }
  };

  // Filter messages based on active type
  const roomMessages = chatMessages.filter((msg) => {
    // Community matches selected region
    if (chatType === 'community') {
      return !selectedDistrict || msg.district === selectedDistrict || msg.isSafetyAlert;
    }
    // Private and groups simulation filters
    if (chatType === 'private') {
      return msg.text.includes('[Private') || (!msg.isSafetyAlert && !msg.text.includes('RED SANKAT'));
    }
    return !msg.isSafetyAlert && msg.text.includes(selectedGroup.substring(0, 5)) || msg.text.includes('Group');
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* Left Sidebar: Navigating between Private, Group and Community spaces */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Main Tab Controls */}
        <div className="bg-white border p-2 rounded-2xl flex flex-col gap-1.5 shadow-xs">
          <span className="text-[9px] uppercase font-bold tracking-wider px-2 text-stone-400">Communication Mode</span>
          
          <button
            onClick={() => setChatType('community')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-between transition ${
              chatType === 'community' ? 'bg-emerald-950 text-emerald-50' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <span>Chautari Public Feed</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-400 text-stone-900 font-bold px-1.5 py-0.2 rounded">LIVE</span>
          </button>

          <button
            onClick={() => setChatType('group')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-between transition ${
              chatType === 'group' ? 'bg-emerald-950 text-emerald-50' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>Sajha Group Channels</span>
            </div>
            <span className="text-[10px] bg-stone-105 font-mono text-stone-500 rounded px-1">{GROUPS_DIRECTORIES.length}</span>
          </button>

          <button
            onClick={() => setChatType('private')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-between transition ${
              chatType === 'private' ? 'bg-emerald-950 text-emerald-50' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>Direct Messages</span>
            </div>
            <span className="text-[10px] bg-stone-105 font-mono text-stone-500 rounded px-1">{PRIVATE_CONTACTS.length}</span>
          </button>
        </div>

        {/* Directory Items listed based on active selection */}
        {chatType === 'private' && (
          <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-xs">
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b pb-1.5">Direct Contacts</h5>
            <div className="space-y-2">
              {PRIVATE_CONTACTS.map((con) => (
                <div 
                  key={con.name}
                  onClick={() => setSelectedUser(con.name)}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs border text-left transition ${
                    selectedUser === con.name 
                      ? 'border-emerald-800 bg-emerald-50/10 font-bold' 
                      : 'border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900">{con.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${con.active ? 'bg-emerald-600' : 'bg-stone-300'}`} />
                  </div>
                  <p className="text-[10px] text-stone-500 truncate mt-0.5">{con.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatType === 'group' && (
          <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-xs">
            <h5 className="text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b pb-1.5">Collaborative Circles</h5>
            <div className="space-y-2">
              {GROUPS_DIRECTORIES.map((grp) => (
                <div 
                  key={grp.name}
                  onClick={() => setSelectedGroup(grp.name)}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs border text-left transition ${
                    selectedGroup === grp.name 
                      ? 'border-emerald-800 bg-emerald-50/10 font-bold' 
                      : 'border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900 truncate mr-2">{grp.name}</span>
                    <span className="text-[9px] font-mono bg-stone-100 text-stone-500 font-bold px-1.5 rounded">
                      {grp.count}p
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">{grp.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {chatType === 'community' && (
          <div className="bg-emerald-50/50 border border-emerald-250 p-4 rounded-2xl space-y-2.5">
            <h5 className="text-xs font-bold text-emerald-950">🌍 Regional Radio Chautari</h5>
            <p className="text-stone-605 text-[11px] leading-relaxed">
              Every message sent while viewing District <strong className="font-bold underline">{selectedDistrict || 'All Nepal'}</strong> is broadcasted with GPS indicators for active neighbors. Fast, decentralized community dispatching.
            </p>
          </div>
        )}

      </div>

      {/* Main Chat Feed Box */}
      <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-5 shadow-sm min-h-[480px] flex flex-col justify-between">
        
        {/* Chat Box Header detail */}
        <div className="border-b pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border text-emerald-900 flex items-center justify-center font-bold">
              {chatType === 'community' ? '🌍' : chatType === 'group' ? '👥' : '👤'}
            </div>
            <div>
              <h4 className="font-display font-black text-stone-900 text-sm">
                {chatType === 'community' 
                  ? `Public Feed: ${selectedDistrict || 'Nepal Countrywide'}` 
                  : chatType === 'group' 
                  ? selectedGroup 
                  : `Conversation with ${selectedUser}`}
              </h4>
              <p className="text-[10px] text-stone-400 font-mono tracking-wide">
                🔐 End-to-end Localized Cache Storage (Offline Guarded)
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[9px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-100 font-mono">
              GPS STATUS: ACTIVE
            </span>
          </div>
        </div>

        {/* FEED INNER SCROLL SECTION */}
        <div className="flex-grow overflow-y-auto max-h-[300px] border border-stone-105 my-4 p-4 rounded-2xl bg-stone-50/50 space-y-3">
          {roomMessages.length === 0 ? (
            <div className="text-center py-16 text-stone-450 text-stone-400 text-xs">
              🍵 No messages on this board yet. Introduce yourself or list conditions to start gaffgaff.
            </div>
          ) : (
            roomMessages.map((msg) => {
              const isVoice = msg.text.includes('[🎤 Voice Note');
              const isFile = msg.text.includes('📎 [Attachment:');
              
              return (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed animate-in fade-in-40 ${
                    msg.isSafetyAlert 
                      ? 'bg-red-100 text-red-950 border border-red-300 ml-0 font-bold animate-pulse' 
                      : 'bg-white text-stone-850 border shadow-xs ml-auto'
                  }`}
                >
                  {/* Sender title */}
                  {!msg.isSafetyAlert && (
                    <div className="flex justify-between items-center text-[9px] text-stone-400 font-bold mb-1 gap-4">
                      <span className="text-emerald-900 font-black">👤 {msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Body text checking */}
                  <div className="space-y-2">
                    {isVoice ? (
                      /* Highlight voice note */
                      <div className="flex items-center gap-2 bg-stone-50 p-2 border rounded-xl w-fit">
                        <button 
                          type="button" 
                          onClick={() => playPauseAudio(msg.id)}
                          className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center hover:bg-emerald-950"
                        >
                          {playingClipId === msg.id ? <Pause size={10} /> : <Play size={10} className="ml-0.5" />}
                        </button>
                        <Volume2 className="text-emerald-900 animate-pulse" size={13} />
                        <span className="font-mono text-stone-600 text-[10px]">Play Audio {msg.text.match(/Voice Note - (.*?)\]/)?.[1] || '0:12'}</span>
                      </div>
                    ) : isFile ? (
                      /* Display document representation */
                      <div className="bg-stone-50 border p-2.5 rounded-xl flex items-center gap-2.5 w-fit">
                        <File className="text-emerald-805 text-emerald-800" size={16} />
                        <div>
                          <p className="font-bold text-[10px] text-stone-900 truncate max-w-[120px]">
                            {msg.text.match(/Attachment: (.*?) \(/)?.[1] || 'Document.pdf'}
                          </p>
                          <p className="text-[8px] text-stone-400">{msg.text.match(/\((.*?)\)/)?.[1] || '120 KB'}</p>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); alert('Simulated File Download successfully!'); }} className="text-[10px] text-emerald-900 font-bold underline ml-2 shrink-0">
                          Download
                        </a>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text.substring(msg.text.indexOf(':') + 1) || msg.text}</p>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* INPUT CONTROLS ROW */}
        <div className="space-y-3">
          
          {/* Temporary display attached files */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-emerald-50/50 rounded-xl border border-dashed text-xs">
              {attachedFiles.map((file, i) => (
                <div key={i} className="bg-white px-2.5 py-1.5 border rounded-lg flex items-center gap-1.5 font-sans">
                  <Paperclip size={10} className="text-stone-400" />
                  <span className="font-bold text-[10px] text-stone-700 max-w-[100px] truncate">{file.name}</span>
                  <span className="text-[9px] text-stone-450 text-stone-400">({file.size})</span>
                  <button type="button" onClick={() => handleRemoveAttachment(i)} className="text-stone-400 hover:text-stone-700">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form container */}
          <form onSubmit={handleSendFullMessage} className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="col-span-1 border border-stone-300 rounded-2xl p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 font-semibold"
              />
              
              <input
                type="text"
                required={attachedFiles.length === 0}
                placeholder={currentLang === 'en' ? 'Type message, share monsoon updates...' : 'सन्देश लेख्नुहोस्, बाटोको अवस्था आदि...'}
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                className="col-span-3 border border-stone-300 rounded-2xl p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            {/* Bottom action triggers (voice notes, attachments, dispatchers) */}
            <div className="flex justify-between items-center pt-1">
              
              <div className="flex items-center gap-2">
                {/* Voice note trigger */}
                <button
                  type="button"
                  onMouseDown={startVoiceRecording}
                  onMouseUp={stopVoiceRecording}
                  onTouchStart={startVoiceRecording}
                  onTouchEnd={stopVoiceRecording}
                  className={`p-3 rounded-full transition-all flex items-center justify-center ${
                    isRecording 
                      ? 'bg-red-600 text-stone-50 animate-pulse scale-110' 
                      : 'bg-stone-105 hover:bg-stone-200 text-stone-600'
                  }`}
                  title="Hold to record voice message"
                >
                  <Mic size={15} />
                </button>

                {/* File input attachment */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-full bg-stone-105 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
                  title="Attach Photo or Document file"
                >
                  <Paperclip size={15} />
                </button>

                {isRecording && (
                  <span className="text-xs font-mono font-bold text-red-700 animate-pulse duration-1000">
                    🔴 Recording: 0:{recordDuration.toString().padStart(2, '0')} (Release to dispatch)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-1 shadow-md"
                >
                  <Send size={11} />
                  <span>Send dispatch</span>
                </button>
              </div>

            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
