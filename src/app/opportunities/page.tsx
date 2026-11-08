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
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="teal" className="mb-3">
            Curated Ecosystem Opportunities
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight font-heading">
            Grants, Incubators & Challenges
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Vetted non-dilutive grants, state incubation pipelines, and national competitions curated by EDC HITAM for student innovators.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCat === cat
                    ? 'bg-navy-900 text-white shadow-sm border border-navy-800'
                    : 'bg-slate-100 text-slate-600 hover:text-navy-900 hover:bg-slate-200 border border-slate-200'
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
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((item) => (
              <Card key={item.id} className="border-slate-200 bg-white shadow-card hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="teal" className="text-[10px]">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                        <Calendar className="h-3 w-3" />
                        Deadline: {item.deadline}
                      </span>
                    </div>

                    <CardTitle className="text-xl text-navy-900 font-heading">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-teal-700 font-semibold flex items-center gap-1.5 pt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {item.organization}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Grant / Funding:</span>
                        <span className="text-navy-900 font-bold">{item.grant_or_prize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Location:</span>
                        <span className="text-slate-700 font-medium">{item.location}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <strong className="text-slate-700">Eligibility:</strong> {item.eligibility}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="pt-4 border-t border-slate-100 flex justify-end">
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="navy" size="sm" className="w-full sm:w-auto text-xs gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Apply on Official Portal
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
