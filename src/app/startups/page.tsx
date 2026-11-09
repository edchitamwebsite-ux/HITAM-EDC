'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { INCUBATED_STARTUPS } from '@/lib/data';
import { Startup } from '@/types';
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
  const [startupsList, setStartupsList] = React.useState<Startup[]>(INCUBATED_STARTUPS);
  const [selectedSector, setSelectedSector] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  // Collaboration Request Modal
  const [activeStartup, setActiveStartup] = React.useState<Startup | null>(null);
  const [applicantName, setApplicantName] = React.useState('');
  const [applicantEmail, setApplicantEmail] = React.useState('');
  const [appliedRole, setAppliedRole] = React.useState('');
  const [collabMessage, setCollabMessage] = React.useState('');
  const [collabSent, setCollabSent] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('edc_my_startups');
    if (saved) {
      try {
        const userStartups = JSON.parse(saved);
        if (userStartups.length > 0) {
          const mapped: Startup[] = userStartups.map((s: any) => ({
            id: s.id,
            name: s.name,
            slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tagline: s.tagline,
            description: s.solution || s.problem,
            sector: s.sector || 'AgriTech',
            stage: s.stage || 'Ideation',
            is_student_venture: true,
            founder_names: Array.isArray(s.founder_names) ? s.founder_names : [s.founder_names || 'Student Founder'],
            logo_url: '/images/brand/edc-logo.png',
            lab_allocated: s.lab_allocated || 'Makerspace Bay 4',
            skills_needed: Array.isArray(s.skills_needed) ? s.skills_needed : ['Marketing', 'Frontend Dev'],
            hiring_roles: ['Co-Founder', 'Technical Lead'],
            metrics: { funding_raised_inr: 0, customers: 12, team_size: 2, patent_filed: false },
            created_at: s.created_at || new Date().toISOString(),
            updated_at: s.updated_at || new Date().toISOString()
          }));
          setStartupsList([...mapped, ...INCUBATED_STARTUPS]);
        }
      } catch {}
    }
  }, []);

  const sectors = ['All', 'AgriTech', 'CleanTech_Hardware', 'AI_SaaS', 'Consumer_D2C', 'DeepTech', 'EdTech'];

  const filteredStartups = startupsList.filter((startup) => {
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
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="teal" className="mb-3">
            Catalyst Cohort Directory
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight font-heading">
            HITAM Startup Showcase
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover student-founded companies building hardware, enterprise AI, sustainable materials, and rural technology at the HITAM Green Campus.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/startups/submit">
              <Button variant="teal" size="lg" className="gap-2 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Submit Your Startup Idea
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSector === sec
                    ? 'bg-navy-900 text-white shadow-sm border border-navy-800'
                    : 'bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {sec.replace(/_/g, ' ')}
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

        </div>
      </section>

      {/* Startups Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStartups.map((startup) => (
              <Card key={startup.id} className="border-slate-200 bg-white shadow-card hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="teal">
                        {startup.sector.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs text-slate-500 font-mono font-semibold">
                        {startup.stage.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <CardTitle className="text-2xl text-navy-900 font-heading">
                      {startup.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-teal-700 font-medium pt-1">
                      {startup.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {startup.description}
                    </p>

                    {startup.traction_metric && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
                          Traction Metric:
                        </span>
                        <span className="text-navy-900 font-bold">
                          {startup.traction_metric}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div>
                        Founders: <span className="text-slate-800 font-semibold">{startup.founder_names.join(', ')}</span>
                      </div>
                      {startup.lab_allocated && (
                        <div className="text-[11px] text-teal-700 font-medium">
                          {startup.lab_allocated}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                    {startup.skills_needed && startup.skills_needed.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium">
                        Need: {skill}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="navy"
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
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 font-heading">Collaboration Request Sent!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your inquiry has been forwarded to the founders of <strong>{activeStartup?.name}</strong>. They will review your profile and reach out via email.
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveStartup(null)} className="text-xs">
              Done
            </Button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <Badge variant="teal" className="mb-1 text-[10px]">Team Collaboration</Badge>
              <h3 className="text-xl font-bold text-navy-900 font-heading">Join {activeStartup?.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share what skills you bring to this startup venture.
              </p>
            </div>

            <form onSubmit={handleSendCollab} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your College Email *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="e.g. rahul@hitam.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Role / Skill Set *</label>
                <input
                  type="text"
                  required
                  value={appliedRole}
                  onChange={(e) => setAppliedRole(e.target.value)}
                  placeholder="e.g. Embedded C Developer, UI Designer, Growth"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Message to Founders</label>
                <textarea
                  rows={3}
                  value={collabMessage}
                  onChange={(e) => setCollabMessage(e.target.value)}
                  placeholder="Tell them why you want to build this product..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveStartup(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="navy" size="sm" className="text-xs">
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
