'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FEATURED_EVENTS, INCUBATED_STARTUPS } from '@/lib/data';
import { EventItem, EventStatus, Announcement } from '@/types';
import { 
  ShieldCheck, 
  Calendar, 
  Users, 
  BellRing, 
  Rocket, 
  Download, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  QrCode
} from 'lucide-react';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = React.useState<'events' | 'participants' | 'announcements' | 'startups'>('events');

  // Event State
  const [eventsList, setEventsList] = React.useState<EventItem[]>(FEATURED_EVENTS);
  const [selectedEventId, setSelectedEventId] = React.useState<string>(FEATURED_EVENTS[0].id);

  // Participant Management State
  const [registrations, setRegistrations] = React.useState<any[]>([
    {
      id: 'reg-01',
      reg_code: 'HITAM-CONC-8912',
      event_id: 'concept-fusion-2026',
      lead: { name: 'Arun Kumar', email: 'arun@hitam.org', phone: '+91 98480 12345', college: 'HITAM', department: 'CSE' },
      team_name: 'CogniTech Titans',
      reg_type: 'team',
      status: 'Confirmed',
      attended: true,
      timestamp: '2026-10-18T10:14:00Z'
    },
    {
      id: 'reg-02',
      reg_code: 'HITAM-CONC-8913',
      event_id: 'concept-fusion-2026',
      lead: { name: 'Divya Srikanth', email: 'divya.s@hitam.org', phone: '+91 98480 54321', college: 'HITAM', department: 'ECE' },
      team_name: 'SolarGrid Pioneers',
      reg_type: 'team',
      status: 'Confirmed',
      attended: false,
      timestamp: '2026-10-19T14:22:00Z'
    },
    {
      id: 'reg-03',
      reg_code: 'HITAM-CONC-8914',
      event_id: 'concept-fusion-2026',
      lead: { name: 'Rahul Varma', email: 'rahul.v@cbit.ac.in', phone: '+91 98480 99887', college: 'CBIT Hyderabad', department: 'IT' },
      team_name: 'CyberHawks',
      reg_type: 'team',
      status: 'Pending',
      attended: false,
      timestamp: '2026-10-20T09:05:00Z'
    },
    {
      id: 'reg-04',
      reg_code: 'HITAM-ESUM-1044',
      event_id: 'hitam-e-summit-2026',
      lead: { name: 'Sahithi Reddy', email: 'sahithi@vce.ac.in', phone: '+91 91234 56789', college: 'VNR VJIET', department: 'CSE' },
      team_name: null,
      reg_type: 'individual',
      status: 'Waitlisted',
      attended: false,
      timestamp: '2026-10-21T18:40:00Z'
    }
  ]);

  const [searchParticipant, setSearchParticipant] = React.useState('');
  const [participantStatusFilter, setParticipantStatusFilter] = React.useState('All');

  // Popup & Announcement State
  const [announcementActive, setAnnouncementActive] = React.useState(true);
  const [popupTitle, setPopupTitle] = React.useState('Concept Fusion 2026 Registrations Open!');
  const [popupMessage, setPopupMessage] = React.useState('HITAM Flagship Innovation Conclave. ₹2.5L Prize Pool, Maker Labs Access & Seed Grants.');
  const [popupCtaLabel, setPopupCtaLabel] = React.useState('Register Now');
  const [popupCtaUrl, setPopupCtaUrl] = React.useState('/events/concept-fusion-2026');
  const [popupRepeatPolicy, setPopupRepeatPolicy] = React.useState('once_ever');
  const [popupIsUrgent, setPopupIsUrgent] = React.useState(false);
  const [isSavedNotice, setIsSavedNotice] = React.useState(false);

  // New Event Modal
  const [isCreateEventOpen, setIsCreateEventOpen] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventSlug, setNewEventSlug] = React.useState('');
  const [newEventTagline, setNewEventTagline] = React.useState('');
  const [newEventCategory, setNewEventCategory] = React.useState('Hackathon');
  const [newEventVenue, setNewEventVenue] = React.useState('HITAM Green Campus Arena');
  const [newEventCapacity, setNewEventCapacity] = React.useState(300);
  const [newEventPrize, setNewEventPrize] = React.useState(100000);

  // Load custom registrations from localStorage
  React.useEffect(() => {
    const localRegs = JSON.parse(localStorage.getItem('edc_my_registrations') || '[]');
    if (localRegs.length > 0) {
      const mapped = localRegs.map((r: any, idx: number) => ({
        id: `local-${idx}`,
        reg_code: r.reg_code,
        event_id: r.event_id,
        lead: r.lead,
        team_name: r.team_name,
        reg_type: r.reg_type,
        status: 'Confirmed',
        attended: false,
        timestamp: r.timestamp
      }));
      setRegistrations(prev => [...mapped, ...prev]);
    }
  }, []);

  // Filtered Participants
  const filteredParticipants = registrations.filter((reg) => {
    const matchesEvent = reg.event_id === selectedEventId;
    const matchesStatus = participantStatusFilter === 'All' || reg.status === participantStatusFilter;
    const matchesSearch = reg.lead.name.toLowerCase().includes(searchParticipant.toLowerCase()) ||
                          reg.lead.email.toLowerCase().includes(searchParticipant.toLowerCase()) ||
                          reg.reg_code.toLowerCase().includes(searchParticipant.toLowerCase()) ||
                          (reg.team_name && reg.team_name.toLowerCase().includes(searchParticipant.toLowerCase()));
    return matchesEvent && matchesStatus && matchesSearch;
  });

  // Toggle Event Registration Status (Open / Closed)
  const handleToggleRegistration = (id: string) => {
    setEventsList(eventsList.map(e => e.id === id ? { ...e, registration_open: !e.registration_open } : e));
  };

  // Toggle Participant Attendance
  const handleToggleAttendance = (id: string) => {
    setRegistrations(registrations.map(r => r.id === id ? { ...r, attended: !r.attended } : r));
  };

  // Status Change for Participant
  const handleUpdateParticipantStatus = (id: string, newStatus: string) => {
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const selectedEvent = eventsList.find(e => e.id === selectedEventId);
    const headers = ['Registration Code', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Team Name', 'Type', 'Status', 'Attended', 'Registered At'];
    
    const rows = filteredParticipants.map(r => [
      r.reg_code,
      `"${r.lead.name}"`,
      r.lead.email,
      r.lead.phone,
      `"${r.lead.college}"`,
      `"${r.lead.department}"`,
      `"${r.team_name || 'N/A'}"`,
      r.reg_type,
      r.status,
      r.attended ? 'Yes' : 'No',
      new Date(r.timestamp).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedEvent?.slug || 'event'}-participants-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Announcement Settings
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Create Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventSlug) return;

    const newEvent: EventItem = {
      id: newEventSlug,
      title: newEventTitle,
      slug: newEventSlug,
      tagline: newEventTagline,
      category: newEventCategory as any,
      description: 'Event created via EDC Administration Studio.',
      start_time: '2026-12-01T09:00:00+05:30',
      end_time: '2026-12-02T18:00:00+05:30',
      venue: newEventVenue,
      max_registrations: Number(newEventCapacity),
      current_registrations: 0,
      prize_pool_inr: Number(newEventPrize),
      is_team_event: true,
      min_team_size: 1,
      max_team_size: 4,
      registration_fee_inr: 0,
      status: 'Published',
      registration_open: true,
      registration_deadline: '2026-11-28T23:59:00+05:30',
      waitlist_enabled: true,
      require_approval: false,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEventsList([newEvent, ...eventsList]);
    setIsCreateEventOpen(false);
    setNewEventTitle('');
    setNewEventSlug('');
    setNewEventTagline('');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24">
      
      {/* Admin Top Header */}
      <section className="py-8 border-b border-slate-800 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">EDC HITAM Command Center</h1>
                  <Badge variant="amber" className="text-[10px]">Super Admin</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authenticated Role: Super Administrator (edc.hitam.website@hitam.org)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs">
                  Exit to Website
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Admin Section Tabs */}
      <section className="border-b border-slate-800 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Event Studio & Controls
          </button>

          <button
            onClick={() => setActiveTab('participants')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'participants'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            Participant Management & CSV
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BellRing className="h-4 w-4" />
            Announcement & Popup Engine
          </button>

          <button
            onClick={() => setActiveTab('startups')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'startups'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Rocket className="h-4 w-4" />
            Incubation Pipeline Moderation
          </button>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* =====================================================================
              TAB 1: EVENT STUDIO & INDEPENDENT REGISTRATION CONTROLS
          ===================================================================== */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Event Creation & Independent Lifecycle Controls</h2>
                  <p className="text-xs text-slate-400">Configure deadlines, capacities, open/closed switches without code changes</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsCreateEventOpen(true)} className="text-xs gap-1.5">
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {eventsList.map((evt) => (
                  <Card key={evt.id} className="border-slate-800 glass-panel p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                          <Badge variant="hitam" className="text-[10px]">{evt.category}</Badge>
                          {evt.is_featured && <Badge variant="amber" className="text-[10px]">Featured</Badge>}
                        </div>
                        <p className="text-xs text-slate-400">{evt.tagline}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
                          <span>Venue: {evt.venue}</span>
                          <span>Capacity: {evt.current_registrations} / {evt.max_registrations}</span>
                          <span>Prize Pool: ₹{evt.prize_pool_inr.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Independent Action Switches */}
                      <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                        {/* Registration Toggle */}
                        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                          <span className="text-slate-400">Registration:</span>
                          <button
                            onClick={() => handleToggleRegistration(evt.id)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              evt.registration_open 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-red-950 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {evt.registration_open ? 'OPEN' : 'CLOSED'}
                          </button>
                        </div>

                        <Link href={`/events/${evt.slug}`} target="_blank">
                          <Button variant="outline" size="sm" className="text-xs gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Live Page
                          </Button>
                        </Link>

                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => {
                            setSelectedEventId(evt.id);
                            setActiveTab('participants');
                          }}
                          className="text-xs"
                        >
                          View Rosters
                        </Button>
                      </div>

                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 2: PARTICIPANT MANAGEMENT & CSV EXPORT
          ===================================================================== */}
          {activeTab === 'participants' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Participant Rosters & Attendance Registry</h2>
                  <p className="text-xs text-slate-400">Review submissions, approve delegates, record attendance, and export authorized CSVs</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="primary" size="sm" onClick={handleExportCSV} className="text-xs gap-1.5 shadow-glow-sm">
                    <Download className="h-4 w-4" />
                    Export CSV Roster
                  </Button>
                </div>
              </div>

              {/* Event Selector & Filters */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Select Event */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-semibold text-slate-400 shrink-0">Selected Event:</span>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  >
                    {eventsList.map((e) => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  {['All', 'Confirmed', 'Pending', 'Waitlisted'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setParticipantStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        participantStatusFilter === st
                          ? 'bg-hitam-600 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search applicant or code..."
                    value={searchParticipant}
                    onChange={(e) => setSearchParticipant(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

              </div>

              {/* Roster Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5 pl-5">Code</th>
                        <th className="p-3.5">Candidate / Team</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">College</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Attendance</th>
                        <th className="p-3.5 pr-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">
                            No participants found for this event and filter combination.
                          </td>
                        </tr>
                      ) : (
                        filteredParticipants.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5 pl-5 font-mono font-bold text-hitam-400">
                              {reg.reg_code}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-white block">{reg.lead.name}</span>
                              {reg.team_name && (
                                <span className="text-[11px] text-amber-400">Team: {reg.team_name}</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div>{reg.lead.email}</div>
                              <div className="text-slate-500 text-[10px]">{reg.lead.phone}</div>
                            </td>
                            <td className="p-3.5">
                              <div>{reg.lead.college}</div>
                              <div className="text-slate-500 text-[10px]">{reg.lead.department}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                reg.status === 'Confirmed' 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                                  : reg.status === 'Waitlisted'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleAttendance(reg.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                                  reg.attended
                                    ? 'bg-hitam-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {reg.attended ? 'Checked In' : 'Not Present'}
                              </button>
                            </td>
                            <td className="p-3.5 pr-5 text-right space-x-1.5">
                              {reg.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateParticipantStatus(reg.id, 'Confirmed')}
                                  className="p-1 rounded hover:bg-emerald-950 text-emerald-400"
                                  title="Approve & Confirm"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              {reg.status !== 'Waitlisted' && (
                                <button
                                  onClick={() => handleUpdateParticipantStatus(reg.id, 'Waitlisted')}
                                  className="p-1 rounded hover:bg-amber-950 text-amber-400"
                                  title="Move to Waitlist"
                                >
                                  <Clock className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =====================================================================
              TAB 3: REUSABLE ANNOUNCEMENT & POPUP ENGINE
          ===================================================================== */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white">Institutional Popup & Alert Configuration</h2>
                <p className="text-xs text-slate-400">Broadcast important notifications across the website with repeat policies and persistent dismissal tracking</p>
              </div>

              {isSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-scale-in">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Announcement configuration saved and published live!</span>
                </div>
              )}

              <Card className="border-slate-800 bg-slate-900/80 p-6 sm:p-8">
                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  
                  {/* Master Enable Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-bold text-white text-sm block">Enable Announcement Popup</span>
                      <span className="text-xs text-slate-400">Controls whether students receive this alert upon visiting</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnnouncementActive(!announcementActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        announcementActive ? 'bg-hitam-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {announcementActive ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  {/* Urgency Switch */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="font-bold text-white text-sm block">Urgent Notice Mode</span>
                      <span className="text-xs text-slate-400">Displays red priority indicator for deadlines or critical cancellations</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPopupIsUrgent(!popupIsUrgent)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        popupIsUrgent ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {popupIsUrgent ? 'URGENT (RED)' : 'NORMAL'}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Popup Heading *</label>
                    <input
                      type="text"
                      required
                      value={popupTitle}
                      onChange={(e) => setPopupTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Message Content *</label>
                    <textarea
                      rows={3}
                      required
                      value={popupMessage}
                      onChange={(e) => setPopupMessage(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={popupCtaLabel}
                        onChange={(e) => setPopupCtaLabel(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Target URL</label>
                      <input
                        type="text"
                        value={popupCtaUrl}
                        onChange={(e) => setPopupCtaUrl(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Repeat Policy</label>
                    <select
                      value={popupRepeatPolicy}
                      onChange={(e) => setPopupRepeatPolicy(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                    >
                      <option value="once_ever">Show Once per User (Never Repeat after Dismissal)</option>
                      <option value="once_per_session">Show Once per Browser Session</option>
                      <option value="always_until_dismissed">Show Until User Clicks Dismiss</option>
                      <option value="on_version_update">Re-trigger for Everyone on New Version Bump</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="primary" size="md" className="text-xs px-6 shadow-glow-sm">
                      Publish Announcement Settings
                    </Button>
                  </div>

                </form>
              </Card>

            </div>
          )}

          {/* =====================================================================
              TAB 4: STARTUP PIPELINE MODERATION
          ===================================================================== */}
          {activeTab === 'startups' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Incubation Pipeline & Idea Submissions</h2>
                <p className="text-xs text-slate-400">Review student blueprints submitted via the Venture Foundry</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INCUBATED_STARTUPS.map((st) => (
                  <Card key={st.id} className="border-slate-800 glass-panel p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="hitam" className="text-[10px]">{st.sector.replace('_', ' ')}</Badge>
                      <span className="text-xs text-hitam-400 font-bold">{st.stage.replace('_', ' ')}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{st.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2">{st.tagline}</p>
                    
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div>Founders: <span className="text-white">{st.founder_names.join(', ')}</span></div>
                      <div>Cohort: <span className="text-hitam-300">{st.incubation_cohort || 'General Incubation'}</span></div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Assign Mentor
                      </Button>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Allocate Bay Space
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* CREATE EVENT MODAL */}
      <Modal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        maxWidth="lg"
      >
        <div>
          <div className="mb-4">
            <Badge variant="hitam" className="mb-1 text-[10px]">Event Studio</Badge>
            <h3 className="text-xl font-bold text-white">Create New Conclave or Sprint</h3>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => {
                    setNewEventTitle(e.target.value);
                    setNewEventSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="e.g. HITAM AI Hackathon 2026"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={newEventSlug}
                  onChange={(e) => setNewEventSlug(e.target.value)}
                  placeholder="hitam-ai-hackathon-2026"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tagline</label>
              <input
                type="text"
                value={newEventTagline}
                onChange={(e) => setNewEventTagline(e.target.value)}
                placeholder="Brief one-line summary"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Flagship_Conclave">Flagship Conclave</option>
                  <option value="Pitch_Showdown">Pitch Showdown</option>
                  <option value="Workshop_Bootcamp">Workshop & Bootcamp</option>
                  <option value="Ideathon">Ideathon</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Capacity</label>
                <input
                  type="number"
                  value={newEventCapacity}
                  onChange={(e) => setNewEventCapacity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Prize Pool (INR)</label>
                <input
                  type="number"
                  value={newEventPrize}
                  onChange={(e) => setNewEventPrize(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Venue</label>
              <input
                type="text"
                value={newEventVenue}
                onChange={(e) => setNewEventVenue(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateEventOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="text-xs">
                Create & Publish
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}
