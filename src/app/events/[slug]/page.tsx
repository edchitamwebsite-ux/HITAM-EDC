'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FEATURED_EVENTS } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Share2, 
  Download, 
  Sparkles,
  ArrowLeft,
  QrCode,
  Check
} from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const event = FEATURED_EVENTS.find((e) => e.slug === slug) || FEATURED_EVENTS[0];

  // Dynamic Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState<any | null>(null);

  // Form Fields
  const [regType, setRegType] = React.useState<'individual' | 'team'>('individual');
  const [teamName, setTeamName] = React.useState('');
  const [leadName, setLeadName] = React.useState('');
  const [leadEmail, setLeadEmail] = React.useState('');
  const [leadPhone, setLeadPhone] = React.useState('');
  const [leadCollege, setLeadCollege] = React.useState('HITAM');
  const [leadDepartment, setLeadDepartment] = React.useState('CSE');
  const [leadYear, setLeadYear] = React.useState('2026');
  
  // Dynamic Team Members
  const [members, setMembers] = React.useState<Array<{ name: string; email: string; college: string }>>([
    { name: '', email: '', college: 'HITAM' }
  ]);

  const [formError, setFormError] = React.useState<string | null>(null);

  const deadline = new Date(event.registration_deadline);
  const isExpired = new Date() > deadline;
  const isFull = event.current_registrations >= event.max_registrations;
  const canRegister = event.registration_open && !isExpired && !isFull;

  const handleAddMember = () => {
    if (members.length < (event.max_team_size - 1)) {
      setMembers([...members, { name: '', email: '', college: 'HITAM' }]);
    }
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: string, value: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    setMembers(updated);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!leadName || !leadEmail || !leadPhone) {
      setFormError('Please fill in all required primary contact fields.');
      return;
    }

    if (regType === 'team' && !teamName.trim()) {
      setFormError('Please provide a team name.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate registration code
      const regCode = `HITAM-${event.slug.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const payload = {
        event_id: event.id,
        reg_code: regCode,
        reg_type: regType,
        team_name: regType === 'team' ? teamName : null,
        lead: {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          college: leadCollege,
          department: leadDepartment,
          graduation_year: leadYear
        },
        members: regType === 'team' ? members.filter(m => m.name.trim() !== '') : [],
        timestamp: new Date().toISOString()
      };

      // Store in localStorage for client persistence and dispatch
      const existing = JSON.parse(localStorage.getItem('edc_my_registrations') || '[]');
      
      // Check duplicate
      const isDuplicate = existing.some((r: any) => r.event_id === event.id && r.lead.email.toLowerCase() === leadEmail.toLowerCase());
      if (isDuplicate) {
        setFormError('A registration with this email address already exists for this event.');
        setIsSubmitting(false);
        return;
      }

      existing.push(payload);
      localStorage.setItem('edc_my_registrations', JSON.stringify(existing));

      // Also simulate API post if backend endpoint available
      fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setRegistrationSuccess(payload);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24">
      
      {/* Top Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Events Directory
        </Link>
      </div>

      {/* Hero Poster Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
            
            {/* Banner Image */}
            <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-slate-950">
              <Image
                src={event.banner_url || '/images/events/ConceptFusion-headerbanner.png'}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Event Floating Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <Badge variant="hitam" className="bg-slate-950/80 backdrop-blur-md">
                  {event.category.replace('_', ' ')}
                </Badge>
                {event.prize_pool_inr > 0 && (
                  <Badge variant="amber" className="bg-slate-950/80 backdrop-blur-md">
                    ₹{event.prize_pool_inr.toLocaleString('en-IN')} Prize Pool
                  </Badge>
                )}
              </div>

              {/* Title Overlay in Banner */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {event.title}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-hitam-300 font-medium max-w-3xl">
                  {event.tagline}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Grid: Details + Registration Action Card */}
      <section className="mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left 8 Columns: Description, Rules, FAQ */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* About the Event */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">About the Conclave</h2>
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-4">
                  <p>{event.about || event.description}</p>
                  <p>
                    Participants will have direct access to HITAM IoT and AI prototyping bays, dedicated mentors from T-Hub, IIIT-Hyderabad CIE, and state innovation councils, along with non-dilutive seed prizes.
                  </p>
                </div>
              </div>

              {/* Eligibility & Guidelines */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">Eligibility & Guidelines</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <span className="font-bold text-white text-sm block">Who Can Participate</span>
                    <p>{event.eligibility_criteria || 'Undergraduate and postgraduate students across all branches and institutions.'}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <span className="font-bold text-white text-sm block">Team Limits</span>
                    <p>
                      {event.is_team_event 
                        ? `Teams of ${event.min_team_size} to ${event.max_team_size} members. Inter-disciplinary teams are strongly encouraged.` 
                        : 'Individual participation only.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules & Deliverables */}
              {event.rules && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Rules & Code of Conduct</h2>
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <p>{event.rules}</p>
                  </div>
                </div>
              )}

              {/* FAQs */}
              {event.faqs && event.faqs.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {event.faqs.map((faq, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-hitam-400 shrink-0" />
                          {faq.question}
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed pl-6">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinators Contact */}
              {event.coordinators && (
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Organizing Committee
                    </span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      {event.coordinators}
                    </span>
                  </div>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="text-xs">
                      Contact Desk
                    </Button>
                  </Link>
                </div>
              )}

            </div>

            {/* Right 4 Columns: Sticky Registration & Logistics Console */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                
                {/* Registration Card */}
                <Card className="border-slate-700 bg-slate-900/90 shadow-2xl overflow-hidden">
                  <CardHeader className="bg-slate-950/70 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Registration Status
                      </span>
                      {canRegister ? (
                        <Badge variant="hitam" className="text-[10px]">Open</Badge>
                      ) : isFull ? (
                        <Badge variant="amber" className="text-[10px]">Full</Badge>
                      ) : (
                        <Badge variant="danger" className="text-[10px]">Closed</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-black text-white pt-1">
                      {event.registration_fee_inr === 0 ? 'Free Entry' : `₹${event.registration_fee_inr}`}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-6">
                    {/* Dates & Location summary */}
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 text-hitam-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold text-white">Event Date</span>
                          <span>{new Date(event.start_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold text-white">Registration Deadline</span>
                          <span>{new Date(event.registration_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-hitam-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold text-white">Venue</span>
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Trophy className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block font-bold text-white">Prize Pool</span>
                          <span className="font-semibold text-amber-400">₹{event.prize_pool_inr.toLocaleString('en-IN')} Cash & Grants</span>
                        </div>
                      </div>
                    </div>

                    {/* Spots Meter */}
                    <div className="pt-3 border-t border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Participants Enrolled</span>
                        <span className="font-semibold text-white">{event.current_registrations} / {event.max_registrations}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-hitam-500 rounded-full"
                          style={{ width: `${Math.min(100, (event.current_registrations / event.max_registrations) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-hitam-400 font-medium block text-right">
                        {event.max_registrations - event.current_registrations} spots left
                      </span>
                    </div>

                    {/* Registration Trigger Button */}
                    <div className="pt-4">
                      {canRegister ? (
                        <Button 
                          variant="primary" 
                          size="lg" 
                          onClick={() => setIsRegisterModalOpen(true)}
                          className="w-full justify-center text-sm py-3.5 shadow-glow-sm"
                        >
                          Register for {event.title}
                        </Button>
                      ) : isFull ? (
                        <Button 
                          variant="secondary" 
                          size="lg" 
                          onClick={() => setIsRegisterModalOpen(true)}
                          className="w-full justify-center text-sm py-3.5 text-amber-300 border-amber-500/30"
                        >
                          Join Waitlist
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="lg" 
                          disabled 
                          className="w-full justify-center text-sm py-3.5"
                        >
                          Registrations Closed
                        </Button>
                      )}
                    </div>

                    <p className="text-[11px] text-center text-slate-500 pt-1">
                      Verified HITAM students and external delegates accepted. Instant confirmation provided.
                    </p>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DYNAMIC REGISTRATION MODAL
      ========================================================================= */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
          setRegistrationSuccess(null);
          setFormError(null);
        }}
        maxWidth="xl"
      >
        {registrationSuccess ? (
          /* Confirmation Success Ticket */
          <div className="text-center py-6 space-y-5 animate-scale-in">
            <div className="inline-flex p-3 rounded-full bg-hitam-950 border border-hitam-500/40 text-hitam-400">
              <Check className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Registration Confirmed!</h3>
              <p className="mt-1 text-xs text-slate-400">
                Your entry for <strong>{event.title}</strong> has been secured in the EDC registry.
              </p>
            </div>

            {/* Visual Digital Ticket */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-500 uppercase">Registration ID:</span>
                <span className="text-hitam-400 font-bold text-sm">{registrationSuccess.reg_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="text-white">{registrationSuccess.lead.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">College:</span>
                <span className="text-white">{registrationSuccess.lead.college}</span>
              </div>
              {registrationSuccess.team_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Team Name:</span>
                  <span className="text-amber-400 font-bold">{registrationSuccess.team_name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-slate-400">{new Date(registrationSuccess.timestamp).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="primary" className="w-full text-xs">
                  Go to Student Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setRegistrationSuccess(null);
                }}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Registration Input Form */
          <div>
            <div className="mb-6">
              <Badge variant="hitam" className="mb-2">Official Registration</Badge>
              <h3 className="text-2xl font-extrabold text-white">{event.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill in your candidate details. Confirmation ticket is instantly issued upon submission.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              
              {/* Individual vs Team Selector */}
              {event.is_team_event && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Participation Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegType('individual')}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        regType === 'individual'
                          ? 'bg-hitam-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Individual Delegate
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegType('team')}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        regType === 'team'
                          ? 'bg-hitam-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      Team (1 to {event.max_team_size} members)
                    </button>
                  </div>
                </div>
              )}

              {/* Team Name if Team Format */}
              {regType === 'team' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Titan Hackers, Agronix"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
              )}

              {/* Primary Contact (Team Lead / Delegate) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Candidate full name"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Official / College Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="e.g. rollno@hitam.org"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+91 90000 00000"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    College *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadCollege}
                    onChange={(e) => setLeadCollege(e.target.value)}
                    placeholder="HITAM, CBIT, etc."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Department & Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadDepartment}
                    onChange={(e) => setLeadDepartment(e.target.value)}
                    placeholder="CSE - 3rd Year"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
                  />
                </div>
              </div>

              {/* Dynamic Additional Team Members */}
              {regType === 'team' && (
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Additional Team Members ({members.length} added)
                    </span>
                    {members.length < (event.max_team_size - 1) && (
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="text-xs text-hitam-400 hover:text-white font-semibold"
                      >
                        + Add Member
                      </button>
                    )}
                  </div>

                  {members.map((member, mIdx) => (
                    <div key={mIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">
                          Member {mIdx + 2}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(mIdx)}
                          className="text-[11px] text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(mIdx, 'name', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        <input
                          type="email"
                          placeholder="Member Email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(mIdx, 'email', e.target.value)}
                          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  className="text-xs px-6"
                >
                  Submit Registration
                </Button>
              </div>

            </form>
          </div>
        )}
      </Modal>

    </div>
  );
}
