'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OPPORTUNITIES_LIST } from '@/lib/data';
import { 
  Compass, 
  Search, 
  Calendar, 
  ExternalLink, 
  Trophy, 
  MapPin, 
  Building2,
  CheckCircle2
} from 'lucide-react';

export default function OpportunitiesPage() {
  const [selectedCat, setSelectedCat] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const categories = ['All', 'Incubation', 'Grant', 'Hackathon', 'Fellowship'];

  const filtered = OPPORTUNITIES_LIST.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            Curated Ecosystem Opportunities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Grants, Incubators & Challenges
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Vetted non-dilutive grants, state incubation pipelines, and national competitions curated by EDC HITAM for student innovators.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCat === cat
                    ? 'bg-hitam-600 text-white shadow-sm border border-hitam-400/40'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search grants, organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>

        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((item) => (
              <Card key={item.id} className="border-slate-800 glass-panel-hover flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="hitam" className="text-[10px]">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-amber-400" />
                        Deadline: {item.deadline}
                      </span>
                    </div>

                    <CardTitle className="text-xl text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-hitam-300 font-semibold flex items-center gap-1.5 pt-0.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {item.organization}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Grant / Funding:</span>
                        <span className="text-amber-400 font-bold">{item.grant_or_prize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Location:</span>
                        <span className="text-slate-200">{item.location}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <strong>Eligibility:</strong> {item.eligibility}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-slate-800/80 flex justify-end">
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                      Apply via Official Portal
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
