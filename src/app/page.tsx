import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { 
  INSTITUTIONAL_STATS, 
  THREE_PILLARS, 
  FEATURED_EVENTS, 
  INCUBATED_STARTUPS 
} from '@/lib/data';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Compass, 
  ChevronRight, 
  CheckCircle2, 
  Flame
} from 'lucide-react';

export default function HomePage() {
  const flagship = FEATURED_EVENTS[0]; // Concept Fusion 2026

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      
      {/* =========================================================================
          1. HERO SECTION: EDITORIAL INSTITUTIONAL AUTHORITY
      ========================================================================= */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Accreditation Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50 border border-navy-200 text-xs font-semibold text-navy-900 mb-6 shadow-subtle">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span>Entrepreneurship Development Cell • HITAM Autonomous</span>
              <ChevronRight className="h-3 w-3 text-teal-600" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.12] font-heading">
              Where Student Ingenuity Becomes <br className="hidden sm:inline" />
              <span className="text-teal-700">
                Venture-Grade
              </span> Innovation.
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Empowering engineers, student builders, and aspiring founders at the Hyderabad Institute of Technology and Management through dedicated maker labs, venture mentorship, and seed grants.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <Link href="/events" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-card">
                  <Calendar className="h-4 w-4" />
                  Explore Events
                </Button>
              </Link>
              
              <Link href="/startups/submit" className="w-full sm:w-auto">
                <Button variant="teal" size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-card">
                  <Sparkles className="h-4 w-4" />
                  Share Your Idea
                </Button>
              </Link>

              <Link href="/opportunities" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-sm">
                  <Compass className="h-4 w-4 text-teal-600" />
                  Explore Opportunities
                </Button>
              </Link>

              <Link href="/community" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2 text-sm">
                  <Users className="h-4 w-4 text-slate-600" />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Institutional Credentials */}
            <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" /> NAAC A+ Accredited Campus
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" /> T-Hub Ecosystem Pipeline
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" /> Dedicated Green Campus Makerspace
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. IMPACT METRICS STRIP
      ========================================================================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {INSTITUTIONAL_STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight font-heading">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm font-semibold text-teal-700">
                  {stat.label}
                </span>
                <span className="mt-0.5 text-xs text-slate-500">
                  {stat.subtext}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FLAGSHIP SPOTLIGHT: CONCEPT FUSION 2026
      ========================================================================= */}
      <section className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <Flame className="h-4 w-4 text-amber-600" />
                Featured Flagship Conclave
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
                Concept Fusion 2026
              </h2>
            </div>
            <Link href="/events" className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group">
              View All EDC Events <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Event Image Banner */}
              <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] bg-slate-100">
                <Image
                  src={flagship.banner_url || '/images/events/ConceptFusion-headerbanner.png'}
                  alt={flagship.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Event Details Panel */}
              <div className="lg:col-span-5 p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="teal">Registrations Open</Badge>
                    <Badge variant="amber">₹2,50,000 Prize Pool</Badge>
                    <Badge variant="outline">Team of 1-4</Badge>
                  </div>

                  <h3 className="text-2xl font-bold text-navy-900 tracking-tight font-heading">
                    {flagship.tagline}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {flagship.description}
                  </p>

                  <div className="mt-5 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                      <span><strong>Date:</strong> 20 – 22 November, 2026 (3 Days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                      <span><strong>Venue:</strong> HITAM Campus, Medchal, Hyderabad</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-600 shrink-0" />
                      <span><strong>Tracks:</strong> AI/ML, CleanTech, Smart Cities, HealthTech</span>
                    </div>
                  </div>
                </div>

                {/* Registration CTA & Spots Tracker */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Availability:</span>
                    <span className="font-semibold text-teal-800">
                      {flagship.max_registrations - flagship.current_registrations} spots remaining
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-teal-600 rounded-full transition-all"
                      style={{ width: `${(flagship.current_registrations / flagship.max_registrations) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Link href={`/events/${flagship.slug}`} className="flex-1">
                      <Button variant="primary" className="w-full justify-center text-xs py-2.5 gap-2">
                        Register for Concept Fusion
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/events/${flagship.slug}`}>
                      <Button variant="outline" className="text-xs py-2.5">
                        Rules & FAQs
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE THREE PILLARS: THINK • BUILD • INSPIRE
      ========================================================================= */}
      <section className="py-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              The HITAM Innovation Framework
            </span>
            <h2 className="mt-1.5 text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
              Three Pillars of Experiential Venture Creation
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              We reject passive theoretical lectures. EDC HITAM is structured as a venture foundry where students systematically convert engineering curiosity into market-validated products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THREE_PILLARS.map((pillar) => (
              <Card key={pillar.number} className="relative flex flex-col justify-between border-slate-200 institutional-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {pillar.number}
                    </span>
                    <Badge variant="teal" className="text-[10px]">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-navy-900">
                    {pillar.title}
                  </CardTitle>
                  <span className="text-xs font-semibold text-teal-700">
                    {pillar.tagline}
                  </span>
                  <CardDescription className="pt-2 text-xs leading-relaxed text-slate-600">
                    {pillar.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 pt-2">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-heading">
                    Core Initiatives:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {pillar.initiatives.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Link href="/about" className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1">
                    Learn about this track <ChevronRight className="h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. STUDENT STARTUP SHOWCASE: REAL VENTURES
      ========================================================================= */}
      <section className="py-16 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Venture Showcase
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight font-heading">
                Born in HITAM Labs
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Explore real student-founded ventures engineered at HITAM and accelerated through our catalyst cohorts.
              </p>
            </div>
            <Link href="/startups" className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group">
              Explore All Startups <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCUBATED_STARTUPS.map((startup) => (
              <Card key={startup.id} className="border-slate-200 institutional-card flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="teal" className="text-[10px]">
                      {startup.sector.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      {startup.stage.replace('_', ' ')}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-navy-900">
                    {startup.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-teal-700 font-medium">
                    {startup.tagline}
                  </CardDescription>
                  <p className="pt-2 text-xs text-slate-600 leading-relaxed">
                    {startup.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {startup.traction_metric && (
                    <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                        Traction & Deployment:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {startup.traction_metric}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      Founders: <span className="text-slate-800 font-medium">{startup.founder_names.join(', ')}</span>
                    </div>
                    {startup.incubation_cohort && (
                      <span className="text-[11px] text-teal-700 font-medium">
                        {startup.incubation_cohort}
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {startup.skills_needed?.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 border border-slate-200 font-medium">
                        Hiring: {skill}
                      </span>
                    ))}
                  </div>
                  <Link href="/startups">
                    <Button variant="ghost" size="sm" className="text-xs text-teal-700 hover:text-teal-900 gap-1 font-semibold">
                      Collaborate <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. CALL TO ACTION: SUBMIT YOUR STARTUP IDEA
      ========================================================================= */}
      <section className="py-16 bg-navy-900 text-white border-b border-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex p-3 rounded-2xl bg-navy-800 border border-navy-700 text-teal-400 mb-5 shadow-subtle">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Have a Problem You Want to Solve?
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you have a napkin sketch, an early CAD prototype, or a validated hypothesis, EDC HITAM provides the makerspace, mentorship, and initial grants to build it into reality.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/startups/submit">
              <Button variant="teal" size="lg" className="gap-2 text-sm shadow-card">
                <Sparkles className="h-4 w-4" />
                Submit Your Startup Idea
              </Button>
            </Link>

            <Link href="/community">
              <Button variant="outline" size="lg" className="gap-2 text-sm bg-navy-800 text-white border-navy-700 hover:bg-navy-700">
                <Users className="h-4 w-4" />
                Find Co-Founders in Community
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Open to all HITAM undergraduate branches & interdisciplinary teams. Your ideas are protected under the EDC confidentiality charter.
          </p>

        </div>
      </section>

    </div>
  );
}
