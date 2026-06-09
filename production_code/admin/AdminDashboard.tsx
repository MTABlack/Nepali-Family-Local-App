import React, { useState } from 'react';

// Admin Types mapping Phase 4 constraints
interface UserVerificationRequest {
  id: string;
  fullName: string;
  phoneNumber: string;
  cardType: string;
  district: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FraudReport {
  id: string;
  reporterName: string;
  reportedName: string;
  category: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
}

interface ActivityLogs {
  id: string;
  userId: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'verification' | 'fraud' | 'content'>('analytics');

  // Interactive Live Mocks inside State for realistic execution flow
  const [kycRequests, setKycRequests] = useState<UserVerificationRequest[]>([
    {
      id: 'kyc_1',
      fullName: 'मदन भण्डारी',
      phoneNumber: '9851011223',
      cardType: 'Citizenship (नागरिकता)',
      district: 'Jhapa',
      documentUrl: 'https://storage.local.np/docs/cit_01.jpg',
      status: 'pending'
    },
    {
      id: 'kyc_2',
      fullName: 'विन्दा अधिकारी',
      phoneNumber: '9841456789',
      cardType: 'Driver License',
      district: 'Kaski',
      documentUrl: 'https://storage.local.np/docs/lic_33.jpg',
      status: 'pending'
    }
  ]);

  const [fraudReports, setFraudReports] = useState<FraudReport[]>([
    {
      id: 'rep_1',
      reporterName: 'गोपाल रेग्मी',
      reportedName: 'अनिल खड्का',
      category: 'Marketplace Fraud (हाटबजार ठगी)',
      description: 'रु १५०० एडभान्स लिएर पानी पम्प डेलिभरी नगरि फोन ब्लक गरियो।',
      status: 'open'
    },
    {
      id: 'rep_2',
      reporterName: 'सपना पौडेल',
      reportedName: 'Unknown Caller',
      category: 'Spam emergency SOS (झुठो आपतकाल)',
      description: 'झुठो बाढीको अलार्म पोष्ट गरि समाजमा त्रास सिर्जना गरेको।',
      status: 'open'
    }
  ]);

  const auditLogs: ActivityLogs[] = [
    { id: 'log_1', userId: 'usr_jhapa_05', action: 'Failed Registration (Invalid Phone)', ipAddress: '103.112.54.21', timestamp: '2026-06-08 22:42:00' },
    { id: 'log_2', userId: 'usr_kaski_10', action: 'OTP Bypass Prevention triggered', ipAddress: '110.44.115.89', timestamp: '2026-06-08 22:41:00' },
    { id: 'log_3', userId: 'usr_pokhara_4', action: 'Successful Level 3 vouch', ipAddress: '202.166.200.12', timestamp: '2026-06-08 22:38:00' }
  ];

  const handleKycStatus = (id: string, status: 'approved' | 'rejected') => {
    setKycRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const handleResolveFraud = (id: string, status: 'resolved' | 'investigating') => {
    setFraudReports(prev => prev.map(rep => rep.id === id ? { ...rep, status } : rep));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-800">
      
      {/* Admin Central Dashboard Top Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏔️</span>
          <div>
            <h1 className="text-base font-bold text-slate-100">नेपाली परिवार Unified Web Control Vault</h1>
            <p className="text-[10px] font-mono tracking-widest text-[#2563EB] uppercase">National System Administrator Central Core</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Core Nodes operational
          </span>
          <div className="text-right text-xs">
            <span className="text-slate-400">User Session:</span> admin_hq_official
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Hand Navigation Menu Rail */}
        <nav className="space-y-1.5 lg:col-span-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            📊 Analytics & Telementary
          </button>
          
          <button
            onClick={() => setActiveTab('verification')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase flex items-center gap-2 ${
              activeTab === 'verification' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🔐 Identity verification ({kycRequests.filter(r => r.status === 'pending').length})
          </button>
          
          <button
            onClick={() => setActiveTab('fraud')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase flex items-center gap-2 ${
              activeTab === 'fraud' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🛡️ Fraud Center ({fraudReports.filter(r => r.status === 'open').length})
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase flex items-center gap-2 ${
              activeTab === 'content' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🪵 System Security Log Audits
          </button>
        </nav>

        {/* Right Hand Central Viewport */}
        <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl">
          
          {/* TAB 1: ANALYTICS DASHBOARD */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">📊 Real-Time System Metrics Telementary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Total Registered Citizens</span>
                  <p className="text-3xl font-extrabold text-blue-400 mt-2">142,520</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">🏔️ +12.4% Koshi province expansion this week</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Active Guhar alerts</span>
                  <p className="text-3xl font-extrabold text-rose-500 mt-2">12</p>
                  <p className="text-[10px] text-rose-400 font-semibold mt-1">🚨 100% dispatcher callback verified</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">Co-Op seed swaps (Haat)</span>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-2">1,540</p>
                  <p className="text-[10px] text-slate-500 mt-1">Inter-District agricultural trade tracker</p>
                </div>
              </div>

              {/* Country map nodes listing directory */}
              <div className="border border-slate-800 rounded-lg p-5 bg-slate-900">
                <h3 className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-4">Regional Active Operations map Nodes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span>🏔️ Pokhara Metropolitan (Kaski, Gandaki)</span>
                    <strong className="text-blue-500">42,500 active profiles</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span>☀️ Biratnagar Municipality (Morang, Koshi)</span>
                    <strong className="text-blue-500">22,340 active profiles</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span>🌾 Birtamod Ward 2 & 5 (Jhapa, Koshi)</span>
                    <strong className="text-blue-500">18,208 active profiles</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KYC IDENTITY VERIFICATION QUEUE */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">🔐 Level 2 Identity Verification review queues (Citizenship KYC)</h2>
              <div className="space-y-4">
                {kycRequests.map(req => (
                  <div key={req.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-100 text-sm">{req.fullName}</strong>
                        <span className="text-[10px] font-mono uppercase bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded">
                          {req.cardType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Phone: {req.phoneNumber} | Region: {req.district} District</p>
                      <a href="#view" className="text-xs text-[#2563EB] hover:underline block mt-2 font-semibold">
                        📎 View submitted scanned ID files
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleKycStatus(req.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] px-3 py-2 rounded-lg font-bold uppercase transition"
                          >
                            Approve Verify
                          </button>
                          <button
                            onClick={() => handleKycStatus(req.id, 'rejected')}
                            className="bg-rose-900 hover:bg-rose-950 text-white font-mono text-[10px] px-3 py-2 rounded-lg font-bold uppercase transition"
                          >
                            Reject flag
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-mono font-bold uppercase px-2 py-1 rounded ${
                          req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FRAUD DISPUTES LEDGER */}
          {activeTab === 'fraud' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">🛡️ Local Scams & Safety Reports Ledger</h2>
              <div className="space-y-4">
                {fraudReports.map(rep => (
                  <div key={rep.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <span className="text-xs text-rose-400 font-bold font-mono uppercase">🚨 {rep.category}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        rep.status === 'open' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">"{rep.description}"</p>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] text-slate-400">
                      <span>Reporter: <strong>{rep.reporterName}</strong> | Reported node: <strong>{rep.reportedName}</strong></span>
                      {rep.status === 'open' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolveFraud(rep.id, 'investigating')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1.5 rounded text-[10px]"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => handleResolveFraud(rep.id, 'resolved')}
                            className="bg-rose-900 hover:bg-rose-950 text-rose-100 px-2 py-1.5 rounded text-[10px]"
                          >
                            Lock Suspected profile
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM AUDIT LOG FILES */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">🪵 Immutable System Audit logs (Write-Once logs)</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User UID</th>
                      <th className="p-3">Action System Trigger</th>
                      <th className="p-3">Gateway IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b border-slate-850 hover:bg-slate-800/50">
                        <td className="p-3 text-slate-400">{log.timestamp}</td>
                        <td className="p-3 text-blue-400 font-bold">{log.userId}</td>
                        <td className="p-3 text-slate-200">{log.action}</td>
                        <td className="p-3 text-slate-500">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
