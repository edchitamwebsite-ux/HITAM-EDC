'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { INCUBATED_STARTUPS } from '@/lib/data';
import { Startup, StartupSector } from '@/types';
import { 
  Rocket, 
  Search, 
  Sparkles, 
  Users, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Send,
  Building,
  Check
} from 'lucide-react';

export default function StartupsPage() {
  const [selectedSector, setSelectedSector] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  // Collaboration Request Modal
  const [activeStartup, setActiveStartup] = React.useState<Startup | null>(null);
  const [applicantName, setApplicantName] = React.useState('');
  const [applicantEmail, setApplicantEmail] = React.useState('');
  const [appliedRole, setAppliedRole] = React.useState('');
  const [collabMessage, setCollabMessage] = React.useState('');
  const [collabSent, setCollabSent] = React.useState(false);

  const sectors = ['All', 'AgriTech', 'CleanTech_Hardware', 'AI_SaaS', 'Consumer_D2C', 'DeepTech', 'EdTech'];

  const filteredStartups = INCUBATED_STARTUPS.filter((startup) => {
    const matchesSector = selectedSector === 'All' || startup.sector === selectedSector;
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const handleSendCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    const requestPayload = {
      startup_id: activeStartup?.id,
      startup_name: activeStartup?.name,
      applicant_name: applicantName,
      applicant_email: applicantEmail,
      applied_role: appliedRole,
      message: collabMessage,
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('edc_collab_requests') || '[]');
    existing.push(requestPayload);
    localStorage.setItem('edc_collab_requests', JSON.stringify(existing));

    setCollabSent(true);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            Catalyst Cohort Directory
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            HITAM Startup Showcase
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Discover student-founded companies building hardware, enterprise AI, sustainable materials, and rural technology at the HITAM Green Campus.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/startups/submit">
              <Button size="lg" className="gap-2 shadow-glow-sm">
                <Sparkles className="h-4 w-4" />
                Submit Your Startup Idea
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedSector === sec
                    ? 'bg-hitam-600 text-white shadow-sm border border-hitam-400/40'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sec.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by venture name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>

        </div>
      </section>

      {/* Startups Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStartups.map((startup) => (
              <Card key={startup.id} className="border-slate-800 glass-panel-hover flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="hitam">
                        {startup.sector.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {startup.stage.replace('_', ' ')}
                      </span>
                    </div>

                    <CardTitle className="text-2xl text-white">
                      {startup.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-hitam-300 font-medium">
                      {startup.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {startup.description}
                    </p>

                    {startup.traction_metric && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                          Traction Metric:
                        </span>
                        <span className="text-slate-200 font-semibold">
                          {startup.traction_metric}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div>
                        Founders: <span className="text-slate-200 font-medium">{startup.founder_names.join(', ')}</span>
                      </div>
                      {startup.lab_allocated && (
                        <div className="text-[11px] text-hitam-400">
                          {startup.lab_allocated}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                    {startup.skills_needed && startup.skills_needed.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                        Need: {skill}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveStartup(startup);
                      setCollabSent(false);
                      setApplicantName('');
                      setApplicantEmail('');
                      setAppliedRole('');
                      setCollabMessage('');
                    }}
                    className="w-full sm:w-auto text-xs gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Join Team
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Collaboration Modal */}
      <Modal
        isOpen={!!activeStartup}
        onClose={() => setActiveStartup(null)}
        maxWidth="md"
      >
        {collabSent ? (
          <div className="text-center py-6 space-y-4 animate-scale-in">
            <div className="inline-flex p-3 rounded-full bg-hitam-950 border border-hitam-500/40 text-hitam-400">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Collaboration Request Sent!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your inquiry has been forwarded to the founders of <strong>{activeStartup?.name}</strong>. They will review your profile and reach out via email.
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveStartup(null)} className="text-xs">
              Done
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <Badge variant="hitam" className="mb-1 text-[10px]">Team Collaboration</Badge>
              <h3 className="text-xl font-bold text-white">Join {activeStartup?.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Share what skills you bring to this startup venture.
              </p>
            </div>

            <form onSubmit={handleSendCollab} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Your College Email *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="e.g. rahul@hitam.org"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role / Skill Set *</label>
                <input
                  type="text"
                  required
                  value={appliedRole}
                  onChange={(e) => setAppliedRole(e.target.value)}
                  placeholder="e.g. Embedded C Developer, UI Designer, Growth"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Message to Founders</label>
                <textarea
                  rows={3}
                  value={collabMessage}
                  onChange={(e) => setCollabMessage(e.target.value)}
                  placeholder="Tell them why you want to build this product..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveStartup(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="text-xs">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

    </div>
  );
}
