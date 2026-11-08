'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  ShieldCheck,
  Check
} from 'lucide-react';

export default function SubmitStartupIdeaPage() {
  const router = useRouter();

  const [name, setName] = React.useState('');
  const [tagline, setTagline] = React.useState('');
  const [problem, setProblem] = React.useState('');
  const [solution, setSolution] = React.useState('');
  const [targetAudience, setTargetAudience] = React.useState('');
  const [sector, setSector] = React.useState('AgriTech');
  const [stage, setStage] = React.useState('Ideation');
  const [founderNames, setFounderNames] = React.useState('');
  const [skillsNeeded, setSkillsNeeded] = React.useState('');
  const [deckUrl, setDeckUrl] = React.useState('');
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !tagline || !problem || !solution) {
      setError('Please fill in all required problem and solution fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: `draft-${Date.now()}`,
        name,
        tagline,
        problem,
        solution,
        target_audience: targetAudience,
        sector,
        stage,
        founder_names: founderNames.split(',').map(s => s.trim()).filter(Boolean),
        skills_needed: skillsNeeded.split(',').map(s => s.trim()).filter(Boolean),
        deck_url: deckUrl,
        status: 'Under_Review',
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('edc_my_startups') || '[]');
      existing.push(payload);
      localStorage.setItem('edc_my_startups', JSON.stringify(existing));

      // Attempt server post
      fetch('/api/startups/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-24">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link href="/startups" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Startup Showcase
        </Link>
      </div>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <Badge variant="teal" className="mb-2">
              Venture Foundry
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-heading">
              Submit Your Startup Idea
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Every venture at HITAM starts with a raw hypothesis. Fill in your project blueprint to access makerspace bays, mentor reviews, and seed grants.
            </p>
          </div>

          <Card className="border-slate-200 bg-white shadow-card rounded-2xl p-6 sm:p-8">
            {success ? (
              <div className="text-center py-10 space-y-5">
                <div className="inline-flex p-4 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                  <Check className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy-900 font-heading">Idea Blueprint Submitted!</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your venture <strong>{name}</strong> has been logged into the EDC Innovation Registry. The faculty incubation panel will review your application for the upcoming Catalyst Cohort.
                  </p>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <Link href="/dashboard">
                    <Button variant="navy" size="md" className="text-xs">
                      View in My Dashboard
                    </Button>
                  </Link>
                  <Link href="/startups">
                    <Button variant="outline" size="md" className="text-xs">
                      Browse Other Ventures
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Section 1: Basic Identity */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    1. Venture Identity
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Startup / Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Agronix Intelligence"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Primary Sector *
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      >
                        <option value="AgriTech">AgriTech</option>
                        <option value="CleanTech_Hardware">CleanTech & Hardware</option>
                        <option value="AI_SaaS">AI & Enterprise SaaS</option>
                        <option value="DeepTech">DeepTech & Robotics</option>
                        <option value="HealthTech">HealthTech & BioTech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="Consumer_D2C">Consumer Products & D2C</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Elevator Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="One powerful sentence explaining what you do (e.g. Autonomous drone telemetry for dryland cotton farmers)"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Section 2: Problem & Proposed Solution */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    2. Problem & Solution Blueprint
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      What is the specific problem you are solving? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Detail who suffers from this pain point, current inadequate alternatives, and why existing solutions fail..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Your Proposed Solution & Tech Architecture *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      placeholder="Describe your product, prototype, proprietary algorithms, or hardware design..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Target Market / Audience
                      </label>
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g. Medchal farmers, Tier-2 hospitals, SME factories"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Current Development Stage
                      </label>
                      <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      >
                        <option value="Ideation">Ideation (Research & Concept)</option>
                        <option value="Problem_Validated">Problem Validated (Customer Interviews done)</option>
                        <option value="MVP_Built">MVP Built (Functioning Prototype)</option>
                        <option value="Early_Traction">Early Traction (Pilot Customers / Pilots)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Team & Talent Needs */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    3. Team & Collaboration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Founders / Team Members (comma separated)
                      </label>
                      <input
                        type="text"
                        value={founderNames}
                        onChange={(e) => setFounderNames(e.target.value)}
                        placeholder="e.g. Arun Kumar (CSE), Divya (ECE)"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Skills You Want to Recruit on Campus
                      </label>
                      <input
                        type="text"
                        value={skillsNeeded}
                        onChange={(e) => setSkillsNeeded(e.target.value)}
                        placeholder="e.g. Flutter, Embedded C, UI/UX, Sales"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Pitch Deck / CAD / Demo Link (Optional Google Drive or GitHub link)
                    </label>
                    <input
                      type="url"
                      value={deckUrl}
                      onChange={(e) => setDeckUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-600" />
                    Protected under EDC Confidentiality Charter
                  </span>

                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <Link href="/startups">
                      <Button type="button" variant="outline" size="sm" className="text-xs">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      variant="teal" 
                      size="md" 
                      isLoading={isSubmitting}
                      className="text-xs px-6 gap-1.5 shadow-sm"
                    >
                      <Sparkles className="h-4 w-4" />
                      Submit Idea for Evaluation
                    </Button>
                  </div>
                </div>

              </form>
            )}
          </Card>

        </div>
      </section>

    </div>
  );
}
