'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SensitiveWatermark } from '@/components/security/SensitiveWatermark';
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
  QrCode,
  Mail,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = React.useState<'events' | 'participants' | 'announcements' | 'startups' | 'inquiries'>('events');

  // Event State (with persistent overrides)
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

  // Startups & Moderation State
  const [startupsList, setStartupsList] = React.useState<any[]>(INCUBATED_STARTUPS);
  const [collabRequests, setCollabRequests] = React.useState<any[]>([]);

  // Inquiries State
  const [inquiries, setInquiries] = React.useState<any[]>([]);

  // New Event Modal
  const [isCreateEventOpen, setIsCreateEventOpen] = React.useState(false);
  const [newEventTitle, setNewEventTitle] = React.useState('');
  const [newEventSlug, setNewEventSlug] = React.useState('');
  const [newEventTagline, setNewEventTagline] = React.useState('');
  const [newEventCategory, setNewEventCategory] = React.useState('Hackathon');
  const [newEventVenue, setNewEventVenue] = React.useState('HITAM Green Campus Arena');
  const [newEventCapacity, setNewEventCapacity] = React.useState(300);
  const [newEventPrize, setNewEventPrize] = React.useState(100000);

  // Load and synchronize all persistent registries on mount
  React.useEffect(() => {
    // 1. Events persistent state
    const savedEvents = localStorage.getItem('edc_events_registry');
    if (savedEvents) {
      try {
        setEventsList(JSON.parse(savedEvents));
      } catch {}
    }

    // 2. Registrations persistent state
    const savedAllRegs = localStorage.getItem('edc_all_registrations');
    if (savedAllRegs) {
      try {
        setRegistrations(JSON.parse(savedAllRegs));
      } catch {}
    } else {
      // Merge user local registrations if present
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
    }

    // 3. Custom announcement state
    const customAnn = localStorage.getItem('edc_custom_announcement');
    if (customAnn) {
      try {
        const parsed = JSON.parse(customAnn);
        setPopupTitle(parsed.title || popupTitle);
        setPopupMessage(parsed.message || popupMessage);
        setPopupCtaLabel(parsed.cta_label || popupCtaLabel);
        setPopupCtaUrl(parsed.cta_url || popupCtaUrl);
        setPopupRepeatPolicy(parsed.repeat_policy || 'once_ever');
        setAnnouncementActive(parsed.is_active ?? true);
        setPopupIsUrgent(parsed.is_urgent ?? false);
      } catch {}
    }

    // 4. Startups pipeline state (merge user submitted blueprints)
    const userBlueprints = JSON.parse(localStorage.getItem('edc_my_startups') || '[]');
    if (userBlueprints.length > 0) {
      setStartupsList(prev => [...userBlueprints, ...prev]);
    }

    // 5. Contact Inquiries state
    const savedInquiries = JSON.parse(localStorage.getItem('edc_inquiries') || '[]');
    setInquiries(savedInquiries);

    // 6. Collab / Co-Founder match requests
    const savedCollabs = JSON.parse(localStorage.getItem('edc_collab_requests') || '[]');
    setCollabRequests(savedCollabs);
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

  // Toggle Event Registration Status (Open / Closed) with persistent memory
  const handleToggleRegistration = (id: string) => {
    const updated = eventsList.map(e => e.id === id ? { ...e, registration_open: !e.registration_open } : e);
    setEventsList(updated);
    localStorage.setItem('edc_events_registry', JSON.stringify(updated));
  };

  // Toggle Participant Attendance with persistence
  const handleToggleAttendance = (id: string) => {
    const updated = registrations.map(r => r.id === id ? { ...r, attended: !r.attended } : r);
    setRegistrations(updated);
    localStorage.setItem('edc_all_registrations', JSON.stringify(updated));
  };

  // Status Change for Participant with persistence
  const handleUpdateParticipantStatus = (id: string, newStatus: string) => {
    const updated = registrations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRegistrations(updated);
    localStorage.setItem('edc_all_registrations', JSON.stringify(updated));
  };

  // CSV Cell Sanitization preventing CSV Injection (OWASP Formula Injection defense)
  const sanitizeCsvCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    let str = String(val).replace(/"/g, '""');
    // If the cell begins with formula characters, prefix with single quote
    if (/^[=\+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const selectedEvent = eventsList.find(e => e.id === selectedEventId);
    const headers = ['Registration Code', 'Full Name', 'Email', 'Phone', 'College', 'Department', 'Team Name', 'Type', 'Status', 'Attended', 'Registered At'];
    
    const rows = filteredParticipants.map(r => [
      sanitizeCsvCell(r.reg_code),
      sanitizeCsvCell(r.lead.name),
      sanitizeCsvCell(r.lead.email),
      sanitizeCsvCell(r.lead.phone),
      sanitizeCsvCell(r.lead.college),
      sanitizeCsvCell(r.lead.department),
      sanitizeCsvCell(r.team_name || 'N/A'),
      sanitizeCsvCell(r.reg_type),
      sanitizeCsvCell(r.status),
      sanitizeCsvCell(r.attended ? 'Yes' : 'No'),
      sanitizeCsvCell(new Date(r.timestamp).toISOString())
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

  // Save Announcement Settings with persistence across public site
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const noticeConfig = {
      id: 'ann-broadcast-' + Date.now(),
      title: popupTitle,
      message: popupMessage,
      cta_label: popupCtaLabel,
      cta_url: popupCtaUrl,
      repeat_policy: popupRepeatPolicy,
      is_active: announcementActive,
      is_urgent: popupIsUrgent,
      version: Date.now(),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem('edc_custom_announcement', JSON.stringify(noticeConfig));
    try {
      window.dispatchEvent(new CustomEvent('edc_announcement_updated'));
    } catch {}
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Allocate Bay Space for Startup
  const handleAllocateBay = (startupId: string) => {
    const bayNumber = prompt('Enter Makerspace Bay Number to Allocate (e.g. Bay 4 IoT Telemetry Lab):', 'Makerspace Bay 3');
    if (!bayNumber) return;

    const updated = startupsList.map(s => s.id === startupId ? { ...s, lab_allocated: bayNumber, status: 'Incubated' } : s);
    setStartupsList(updated);
    localStorage.setItem('edc_my_startups', JSON.stringify(updated));
    alert(`Makerspace bay "${bayNumber}" successfully allocated to venture.`);
  };

  // Assign Mentor for Startup
  const handleAssignMentor = (startupId: string) => {
    const mentorName = prompt('Enter Faculty / Industry Mentor Name:', 'Dr. Sheela Singh (Dean Incubation)');
    if (!mentorName) return;

    const updated = startupsList.map(s => s.id === startupId ? { ...s, assigned_mentor: mentorName } : s);
    setStartupsList(updated);
    localStorage.setItem('edc_my_startups', JSON.stringify(updated));
    alert(`Mentor "${mentorName}" assigned to venture.`);
  };

  // Mark Inquiry as Responded
  const handleToggleInquiryStatus = (inquiryId: string) => {
    const updated = inquiries.map(inq => inq.id === inquiryId ? { ...inq, status: inq.status === 'Responded' ? 'New' : 'Responded' } : inq);
    setInquiries(updated);
    localStorage.setItem('edc_inquiries', JSON.stringify(updated));
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

    const updated = [newEvent, ...eventsList];
    setEventsList(updated);
    localStorage.setItem('edc_events_registry', JSON.stringify(updated));
    setIsCreateEventOpen(false);
    setNewEventTitle('');
    setNewEventSlug('');
    setNewEventTagline('');
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-24">
      
      {/* Admin Top Header */}
      <section className="py-6 border-b border-navy-800 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">EDC HITAM Command Center</h1>
                  <Badge variant="amber" className="text-[10px]">Super Admin</Badge>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Authenticated Role: Super Administrator (edc.hitam.website@hitam.org)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs border-slate-700 text-slate-200 hover:bg-navy-900"
                >
                  View Website
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  document.cookie = 'edc_admin_auth=; path=/; max-age=0;';
                  document.cookie = 'edc_student_auth=; path=/; max-age=0;';
                  localStorage.removeItem('edc_current_user');
                  window.location.href = '/auth/login';
                }}
                className="text-xs border-red-900/50 bg-red-950/30 text-red-300 hover:bg-red-900/40"
              >
                Sign Out
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Admin Section Tabs */}
      <section className="border-b border-slate-200 bg-white sticky top-16 z-10 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Event Studio & Controls ({eventsList.length})
          </button>

          <button
            onClick={() => setActiveTab('participants')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'participants'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <Users className="h-4 w-4" />
            Participant Management & CSV ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <BellRing className="h-4 w-4" />
            Announcement & Popup Engine
          </button>

          <button
            onClick={() => setActiveTab('startups')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'startups'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <Rocket className="h-4 w-4" />
            Incubation Pipeline Moderation ({startupsList.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-navy-900 text-navy-900'
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Secretariat & Inquiries ({inquiries.length})
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
                  <h2 className="text-xl font-bold text-navy-900 font-heading">Event Creation & Independent Lifecycle Controls</h2>
                  <p className="text-xs text-slate-500">Configure deadlines, capacities, open/closed switches without code changes</p>
                </div>
                <Button variant="navy" size="sm" onClick={() => setIsCreateEventOpen(true)} className="text-xs gap-1.5 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {eventsList.map((evt) => (
                  <Card key={evt.id} className="border-slate-200 bg-white p-5 shadow-card hover:shadow-lg transition-all">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-navy-900 font-heading">{evt.title}</h3>
                          <Badge variant="teal" className="text-[10px]">{evt.category}</Badge>
                          {evt.is_featured && <Badge variant="amber" className="text-[10px]">Featured</Badge>}
                        </div>
                        <p className="text-xs text-slate-500">{evt.tagline}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                          <span>Venue: <strong className="text-slate-800">{evt.venue}</strong></span>
                          <span>Capacity: <strong className="text-slate-800">{evt.current_registrations} / {evt.max_registrations}</strong></span>
                          <span>Prize Pool: <strong className="text-teal-700">₹{evt.prize_pool_inr.toLocaleString('en-IN')}</strong></span>
                        </div>
                      </div>

                      {/* Independent Action Switches */}
                      <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        {/* Registration Toggle */}
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
                          <span className="text-slate-600 font-medium">Registration:</span>
                          <button
                            onClick={() => handleToggleRegistration(evt.id)}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                              evt.registration_open 
                                ? 'bg-emerald-600 text-white shadow-sm' 
                                : 'bg-red-100 text-red-700 border border-red-200'
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
                  <h2 className="text-xl font-bold text-navy-900 font-heading">Participant Rosters & Attendance Registry</h2>
                  <p className="text-xs text-slate-500">Review submissions, approve delegates, record attendance, and export authorized CSVs</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="navy" size="sm" onClick={handleExportCSV} className="text-xs gap-1.5 shadow-sm">
                    <Download className="h-4 w-4" />
                    Export CSV Roster
                  </Button>
                </div>
              </div>

              {/* Event Selector & Filters */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Select Event */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-semibold text-slate-700 shrink-0">Selected Event:</span>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        participantStatusFilter === st
                          ? 'bg-navy-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search applicant or code..."
                    value={searchParticipant}
                    onChange={(e) => setSearchParticipant(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

              </div>

              {/* Roster Table with Anti-Screenshot Watermarking */}
              <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card">
                
                {/* Discrete Security Watermark */}
                <SensitiveWatermark 
                  identifier="EDC-HITAM-ADMIN-SECURE"
                  subText="CONFIDENTIAL ATTENDANCE ROSTER"
                  density="low"
                />

                <div className="relative z-10 overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
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
                    <tbody className="divide-y divide-slate-100 bg-white/90">
                      {filteredParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            No participants found for this event and filter combination.
                          </td>
                        </tr>
                      ) : (
                        filteredParticipants.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 pl-5 font-mono font-bold text-navy-900">
                              {reg.reg_code}
                            </td>
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block">{reg.lead.name}</span>
                              {reg.team_name && (
                                <span className="text-[11px] text-teal-700 font-medium">Team: {reg.team_name}</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{reg.lead.email}</div>
                              <div className="text-slate-400 text-[10px]">{reg.lead.phone}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="text-slate-800">{reg.lead.college}</div>
                              <div className="text-slate-400 text-[10px]">{reg.lead.department}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                reg.status === 'Confirmed' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : reg.status === 'Waitlisted'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleAttendance(reg.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                                  reg.attended
                                    ? 'bg-teal-700 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {reg.attended ? 'Checked In' : 'Not Present'}
                              </button>
                            </td>
                            <td className="p-3.5 pr-5 text-right space-x-1.5">
                              {reg.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateParticipantStatus(reg.id, 'Confirmed')}
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 border border-transparent hover:border-emerald-200"
                                  title="Approve & Confirm"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              {reg.status !== 'Waitlisted' && (
                                <button
                                  onClick={() => handleUpdateParticipantStatus(reg.id, 'Waitlisted')}
                                  className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 border border-transparent hover:border-amber-200"
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
                <h2 className="text-xl font-bold text-navy-900 font-heading">Institutional Popup & Alert Configuration</h2>
                <p className="text-xs text-slate-500">Broadcast important notifications across the website with repeat policies and persistent dismissal tracking</p>
              </div>

              {isSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Announcement configuration saved and published live across website!</span>
                </div>
              )}

              <Card className="border-slate-200 bg-white shadow-card p-6 sm:p-8">
                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  
                  {/* Master Enable Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-navy-900 text-sm block">Enable Announcement Popup & Banner</span>
                      <span className="text-xs text-slate-500">Controls whether students receive this alert upon visiting</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnnouncementActive(!announcementActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        announcementActive ? 'bg-navy-900 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {announcementActive ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  {/* Urgency Switch */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-navy-900 text-sm block">Urgent Notice Mode</span>
                      <span className="text-xs text-slate-500">Displays red priority indicator for deadlines or critical cancellations</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPopupIsUrgent(!popupIsUrgent)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        popupIsUrgent ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {popupIsUrgent ? 'URGENT (RED)' : 'NORMAL'}
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Popup Heading *</label>
                    <input
                      type="text"
                      required
                      value={popupTitle}
                      onChange={(e) => setPopupTitle(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Message Content *</label>
                    <textarea
                      rows={3}
                      required
                      value={popupMessage}
                      onChange={(e) => setPopupMessage(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">CTA Button Label</label>
                      <input
                        type="text"
                        value={popupCtaLabel}
                        onChange={(e) => setPopupCtaLabel(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Target URL</label>
                      <input
                        type="text"
                        value={popupCtaUrl}
                        onChange={(e) => setPopupCtaUrl(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Repeat Policy</label>
                    <select
                      value={popupRepeatPolicy}
                      onChange={(e) => setPopupRepeatPolicy(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    >
                      <option value="once_ever">Show Once per User (Never Repeat after Dismissal)</option>
                      <option value="once_per_session">Show Once per Browser Session</option>
                      <option value="always_until_dismissed">Show Until User Clicks Dismiss</option>
                      <option value="on_version_update">Re-trigger for Everyone on New Version Bump</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="navy" size="md" className="text-xs px-6 shadow-sm">
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
                <h2 className="text-xl font-bold text-navy-900 font-heading">Incubation Pipeline & Idea Submissions</h2>
                <p className="text-xs text-slate-500">Review student blueprints submitted via the Venture Foundry, assign mentors, and allocate labs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {startupsList.map((st) => (
                  <Card key={st.id} className="border-slate-200 bg-white shadow-card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="teal" className="text-[10px]">{st.sector ? st.sector.replace(/_/g, ' ') : 'General'}</Badge>
                      <span className="text-xs text-navy-900 font-bold">{st.stage ? st.stage.replace(/_/g, ' ') : 'Ideation'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-900 font-heading">{st.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{st.tagline || st.problem}</p>
                    
                    <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                      <div>Founders: <span className="text-slate-900 font-medium">{Array.isArray(st.founder_names) ? st.founder_names.join(', ') : st.founder_names || 'Student Team'}</span></div>
                      {st.lab_allocated && (
                        <div className="text-teal-700 font-medium">Allocated: {st.lab_allocated}</div>
                      )}
                      {st.assigned_mentor && (
                        <div className="text-amber-700 font-medium">Mentor: {st.assigned_mentor}</div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAssignMentor(st.id)} className="text-xs">
                        Assign Mentor
                      </Button>
                      <Button variant="navy" size="sm" onClick={() => handleAllocateBay(st.id)} className="text-xs">
                        Allocate Bay Space
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Co-Founder & Talent Matching Desk */}
              <div className="pt-6 border-t border-slate-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-navy-900 font-heading">Co-Founder & Talent Applications ({collabRequests.length})</h3>
                  <p className="text-xs text-slate-500">Student applications to join venture teams submitted via the public Startup Hub</p>
                </div>

                {collabRequests.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No co-founder applications received yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collabRequests.map((collab, cIdx) => (
                      <Card key={cIdx} className="border-slate-200 bg-white p-5 shadow-card space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge variant="teal" className="text-[10px]">Applied Role: {collab.applied_role || 'General'}</Badge>
                          <span className="text-[11px] text-slate-400">{new Date(collab.timestamp || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-navy-900 font-heading">Target Venture: {collab.startup_name}</h4>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                          &ldquo;{collab.message}&rdquo;
                        </p>
                        <div className="text-xs text-slate-700 flex items-center justify-between pt-1">
                          <span className="font-semibold">{collab.applicant_name}</span>
                          <a href={`mailto:${collab.applicant_email}?subject=Regarding Your Application for ${encodeURIComponent(collab.startup_name || '')}`} className="text-teal-700 hover:underline font-medium">
                            {collab.applicant_email}
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              TAB 5: SECRETARIAT & INCOMING INQUIRIES
          ===================================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy-900 font-heading">Secretariat & Student Inquiries</h2>
                <p className="text-xs text-slate-500">Real-time incoming inquiries submitted from the official Contact desk</p>
              </div>

              {inquiries.length === 0 ? (
                <Card className="border-slate-200 bg-white p-12 text-center max-w-md mx-auto shadow-card">
                  <Mail className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-navy-900 font-heading">No New Inquiries</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    Direct inquiries submitted via the Contact page will appear here immediately for response.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {inquiries.map((inq) => (
                    <Card key={inq.id} className="border-slate-200 bg-white p-5 shadow-card hover:shadow-lg transition-all space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-navy-900 text-sm">{inq.name}</span>
                          <span className="text-xs text-slate-500">&lt;{inq.email}&gt;</span>
                          <Badge variant={inq.status === 'Responded' ? 'outline' : 'teal'} className="text-[10px]">
                            {inq.status || 'New'}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-teal-700 block">Topic: {inq.subject}</span>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {inq.message}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <a href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)} — EDC HITAM`}>
                          <Button variant="outline" size="sm" className="text-xs gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            Email Applicant
                          </Button>
                        </a>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleToggleInquiryStatus(inq.id)}
                          className="text-xs"
                        >
                          {inq.status === 'Responded' ? 'Mark as New' : 'Mark as Responded'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
            <Badge variant="teal" className="mb-1 text-[10px]">Event Studio</Badge>
            <h3 className="text-xl font-bold text-navy-900 font-heading">Create New Conclave or Sprint</h3>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => {
                    setNewEventTitle(e.target.value);
                    setNewEventSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="e.g. HITAM AI Hackathon 2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={newEventSlug}
                  onChange={(e) => setNewEventSlug(e.target.value)}
                  placeholder="hitam-ai-hackathon-2026"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tagline</label>
              <input
                type="text"
                value={newEventTagline}
                onChange={(e) => setNewEventTagline(e.target.value)}
                placeholder="Brief one-line summary"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Flagship_Conclave">Flagship Conclave</option>
                  <option value="Pitch_Showdown">Pitch Showdown</option>
                  <option value="Workshop_Bootcamp">Workshop & Bootcamp</option>
                  <option value="Ideathon">Ideathon</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Capacity</label>
                <input
                  type="number"
                  value={newEventCapacity}
                  onChange={(e) => setNewEventCapacity(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Prize Pool (INR)</label>
                <input
                  type="number"
                  value={newEventPrize}
                  onChange={(e) => setNewEventPrize(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Venue</label>
              <input
                type="text"
                value={newEventVenue}
                onChange={(e) => setNewEventVenue(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateEventOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="navy" size="sm" className="text-xs">
                Create & Publish
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}
