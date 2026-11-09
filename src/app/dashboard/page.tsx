'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SensitiveWatermark } from '@/components/security/SensitiveWatermark';
import { 
  UserCircle, 
  Calendar, 
  Sparkles, 
  Rocket, 
  BellRing, 
  QrCode, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'events' | 'startups' | 'notifications'>('events');
  
  // Loaded user state
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [startups, setStartups] = React.useState<any[]>([]);
  const [userProfile, setUserProfile] = React.useState({
    fullName: 'Shaik Rehan',
    role: 'Student Innovator',
    college: 'HITAM Hyderabad',
    department: 'Computer Science Engineering (2026)',
    email: 'shaik.rehan@hitam.org',
    initials: 'SR'
  });

  React.useEffect(() => {
    // 1. Synchronize Profile
    const savedUser = localStorage.getItem('edc_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        const name = u.fullName || u.name || 'Shaik Rehan';
        const parts = name.split(' ').filter(Boolean);
        const initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
        setUserProfile({
          fullName: name,
          role: u.role === 'admin' ? 'Super Administrator' : 'Student Innovator',
          college: u.college || 'HITAM Hyderabad',
          department: u.department ? `${u.department} (${u.graduationYear || 2026})` : 'Computer Science Engineering (2026)',
          email: u.email || 'student@hitam.org',
          initials: initials
        });
      } catch {}
    }

    // 2. Load local storage registrations synchronized with admin master status
    const savedRegs = JSON.parse(localStorage.getItem('edc_my_registrations') || '[]');
    const allRegs = JSON.parse(localStorage.getItem('edc_all_registrations') || '[]');
    
    const synced = savedRegs.map((reg: any) => {
      const adminMatch = allRegs.find((ar: any) => ar.reg_code === reg.reg_code);
      if (adminMatch) {
        return { ...reg, status: adminMatch.status, attended: adminMatch.attended };
      }
      return reg;
    });
    setRegistrations(synced);

    const savedStartups = JSON.parse(localStorage.getItem('edc_my_startups') || '[]');
    setStartups(savedStartups);
  }, []);

  const handleCancelRegistration = (regCode: string) => {
    if (!confirm('Are you sure you want to cancel this event registration?')) return;
    const updated = registrations.filter(r => r.reg_code !== regCode);
    setRegistrations(updated);
    localStorage.setItem('edc_my_registrations', JSON.stringify(updated));

    // Update master admin roster
    try {
      const allRegs = JSON.parse(localStorage.getItem('edc_all_registrations') || '[]');
      const updatedAll = allRegs.map((r: any) => r.reg_code === regCode ? { ...r, status: 'Cancelled' } : r);
      localStorage.setItem('edc_all_registrations', JSON.stringify(updatedAll));
    } catch {}
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-24">
      
      {/* Dashboard Top Banner */}
      <section className="py-10 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-navy-900 border border-navy-800 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                {userProfile.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-navy-900 font-heading">{userProfile.fullName}</h1>
                  <Badge variant={userProfile.role === 'Super Administrator' ? 'amber' : 'teal'} className="text-[10px]">
                    {userProfile.role}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {userProfile.college} • {userProfile.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/startups/submit">
                <Button variant="teal" size="sm" className="text-xs gap-1.5 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Submit Idea
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Browse Events
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="border-b border-slate-200 bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'events'
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              My Events & Passes ({registrations.length})
            </button>

            <button
              onClick={() => setActiveTab('startups')}
              className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'startups'
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <Rocket className="h-4 w-4" />
              My Startup Ideas ({startups.length})
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'border-navy-900 text-navy-900'
                  : 'border-transparent text-slate-500 hover:text-navy-900'
              }`}
            >
              <BellRing className="h-4 w-4" />
              Announcements & Alerts
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* TAB 1: MY EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-navy-900 font-heading">Registered Conclaves & Hackathons</h2>
                  <p className="text-xs text-slate-500">Digital verification passes protected by institutional watermarking</p>
                </div>
              </div>

              {registrations.length === 0 ? (
                <Card className="border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-card">
                  <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-navy-900 font-heading">No Event Registrations Yet</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    You have not registered for any upcoming conclaves. Explore our flagship events like Concept Fusion 2026.
                  </p>
                  <Link href="/events" className="mt-5 inline-block">
                    <Button variant="navy" size="sm" className="text-xs">
                      Explore Events
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations.map((reg, idx) => (
                    <Card key={idx} className="relative overflow-hidden border-slate-200 bg-white p-6 shadow-card space-y-4">
                      
                      {/* Discrete Anti-Screenshot Watermark */}
                      <SensitiveWatermark 
                        identifier={reg.reg_code}
                        subText="EDC HITAM OFFICIAL PASS"
                        density="normal"
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <Badge 
                          variant={reg.status === 'Cancelled' ? 'outline' : reg.status === 'Waitlisted' ? 'amber' : 'teal'} 
                          className="text-[10px]"
                        >
                          {reg.status ? `${reg.status} Entry Pass` : 'Confirmed Entry Pass'}
                        </Badge>
                        <span className="text-xs font-mono font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {reg.reg_code}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <h3 className="text-lg font-bold text-navy-900 leading-tight font-heading">
                          {reg.event_id === 'concept-fusion-2026' ? 'Concept Fusion 2026' : reg.event_id}
                        </h3>
                        {reg.team_name && (
                          <span className="text-xs text-amber-700 font-semibold block pt-0.5">
                            Team: {reg.team_name}
                          </span>
                        )}
                      </div>

                      <div className="relative z-10 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Applicant:</span>
                          <span className="text-navy-900 font-bold">{reg.lead?.name || 'Candidate'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Format:</span>
                          <span className="text-slate-800 uppercase font-semibold">{reg.reg_type}</span>
                        </div>
                        {reg.members && reg.members.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Teammates:</span>
                            <span className="text-slate-700">{reg.members.map((m: any) => m.name).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className={`text-[11px] font-medium flex items-center gap-1 ${
                          reg.status === 'Cancelled' ? 'text-slate-400' : 'text-teal-700'
                        }`}>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {reg.status === 'Cancelled' 
                            ? 'Pass Cancelled' 
                            : reg.attended 
                            ? 'Attendance Recorded' 
                            : 'Pass Active for Check-In'}
                        </span>
                        {reg.status !== 'Cancelled' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleCancelRegistration(reg.reg_code)}
                              className="text-[11px] py-1 px-2.5 h-auto"
                            >
                              Cancel Pass
                            </Button>
                          </div>
                        )}
                      </div>

                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY STARTUPS */}
          {activeTab === 'startups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-navy-900 font-heading">My Startup Blueprints</h2>
                  <p className="text-xs text-slate-500">Projects logged for incubation and mentor review</p>
                </div>
                <Link href="/startups/submit">
                  <Button variant="navy" size="sm" className="text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    New Project
                  </Button>
                </Link>
              </div>

              {startups.length === 0 ? (
                <Card className="border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-card">
                  <Rocket className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-navy-900 font-heading">No Startup Drafts Yet</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Have an idea in robotics, clean tech, AI, or agriculture? Submit your concept to enter the incubation pipeline.
                  </p>
                  <Link href="/startups/submit" className="mt-5 inline-block">
                    <Button variant="teal" size="sm" className="text-xs">
                      Submit Your Idea
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {startups.map((st, idx) => (
                    <Card key={idx} className="border-slate-200 bg-white p-6 shadow-card space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="amber" className="text-[10px]">
                          {st.stage ? st.stage.replace(/_/g, ' ') : 'Ideation'}
                        </Badge>
                        <span className="text-[11px] text-teal-700 font-semibold">
                          Status: {st.status ? st.status.replace(/_/g, ' ') : 'Under Review'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-navy-900 font-heading">{st.name}</h3>
                      <p className="text-xs text-teal-700 font-medium">{st.tagline}</p>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{st.problem}</p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Sector: {st.sector ? st.sector.replace(/_/g, ' ') : 'AgriTech'}</span>
                        <span>Logged: {new Date(st.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS FEED */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-xl font-bold text-navy-900 font-heading mb-4">Official Notices & Conclave Announcements</h2>
              
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-900 flex items-center gap-1.5">
                    <BellRing className="h-3.5 w-3.5 text-teal-600" />
                    Concept Fusion 2026 Registration Open
                  </span>
                  <span className="text-slate-400">2 days ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Registrations for Concept Fusion 2026 are actively being processed. Over ₹2.5 Lakhs in prize pools and direct incubation access at HITAM Green Campus.
                </p>
                <div className="pt-1">
                  <Link href="/events/concept-fusion-2026" className="text-xs font-semibold text-teal-700 hover:underline">
                    View Event Details →
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-navy-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    Makerspace Hardware Bay 3 Open for Prototyping
                  </span>
                  <span className="text-slate-400">1 week ago</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Student founders with active IoT / hardware blueprints can sign out ESP32 boards, soldering stations, and drone telemetry parts with Kowshik (VP Operations).
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
