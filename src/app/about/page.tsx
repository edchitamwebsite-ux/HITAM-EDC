import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { THREE_PILLARS, INSTITUTIONAL_STATS } from '@/lib/data';
import { 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  Award, 
  Target, 
  Cpu, 
  Globe, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header Banner */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-hitam-400 uppercase tracking-wider">
            About EDC HITAM
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nurturing Founders <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-hitam-300 via-hitam-400 to-emerald-300">
              The Experiential Way
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The Entrepreneurship Development Cell (EDC) at the Hyderabad Institute of Technology and Management (HITAM) is an autonomous venture catalyst transforming technical education into venture impact.
          </p>
        </div>
      </section>

      {/* Institutional Mission & Vision */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <Card className="border-slate-800 glass-panel p-6 sm:p-8">
              <div className="p-3 rounded-2xl bg-hitam-950/80 border border-hitam-500/30 text-hitam-400 inline-block mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission</h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                To cultivate an ecosystem where every student engineer has immediate access to rapid fabrication tools, seasoned industry mentors, customer validation frameworks, and institutional pre-seed capital, enabling them to launch viable commercial ventures prior to graduation.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-hitam-400" />
                  Experiential, problem-first engineering curriculum integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-hitam-400" />
                  Multi-disciplinary team matching across software and hardware
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-hitam-400" />
                  Direct linkages with regional and national angel networks
                </li>
              </ul>
            </Card>

            <Card className="border-slate-800 glass-panel p-6 sm:p-8">
              <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/30 text-amber-400 inline-block mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Our Vision</h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                To establish HITAM as South India premier hub for undergraduate deep tech and sustainable hardware innovation, recognized nationally for graduating student founders who solve systemic industrial and environmental challenges.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  50+ sustainable ventures created per decade
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  Patent-first intellectual property protection for student makers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  Ecosystem pipeline to T-Hub, CIE IIIT-H, and TSIC
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* Experiential Methodology: The 3 Pillars */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-hitam-400 uppercase tracking-wider">
              Methodology
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              The 3 Pillars of Venture Growth
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Each student venture progresses through a structured sequence designed to eliminate assumptions and build durable economic traction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_PILLARS.map((p) => (
              <div key={p.number} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-2xl font-black text-slate-700 font-mono">{p.number}</span>
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <span className="text-xs font-semibold text-hitam-400">{p.tagline}</span>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Infrastructure: Maker Labs */}
      <section className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-hitam-400 uppercase tracking-wider">
                Physical Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Green Campus Makerspace & Incubation Bays
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Located on the lush, biophilic campus in Medchal, the EDC operates dedicated hardware prototyping facilities, electronics testing benches, 3D printing farms, and collaborative co-working incubators open 24/7 during hackathons.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Cpu className="h-5 w-5 text-hitam-400 mb-2" />
                  <span className="font-bold text-white block">IoT & Telemetry Lab</span>
                  <span className="text-slate-400">Sensors, oscilloscopes, drone benches</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <Globe className="h-5 w-5 text-hitam-400 mb-2" />
                  <span className="font-bold text-white block">T-Hub Pipeline</span>
                  <span className="text-slate-400">Direct admission to regional cohorts</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-700 bg-slate-900">
              <Image
                src="/images/events/ConceptFusion-headerbanner.png"
                alt="HITAM Campus"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Begin Your Founder Journey?
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/startups/submit">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Submit Your Idea
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="outline" size="lg">
                Meet the Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
