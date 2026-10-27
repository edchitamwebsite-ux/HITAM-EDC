'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TEAM_MEMBERS } from '@/lib/data';
import { Linkedin, Search, Mail, Users, ShieldCheck } from 'lucide-react';

export default function TeamPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const categories = ['All', 'Faculty Advisory', 'Executive Council', 'Startup Acceleration', 'Corporate Alliances', 'Media & Outreach'];

  const filteredMembers = TEAM_MEMBERS.filter((member) => {
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Page Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            Institutional Leadership
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Minds Driving EDC HITAM
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Meet the faculty advisors, student innovators, and operations leads orchestrating venture cohorts, makerspace labs, and flagship conclaves.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-hitam-600 text-white shadow-sm border border-hitam-400/40'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>

        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              No team members found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="border-slate-800 glass-panel-hover flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Member Portrait */}
                    <div className="relative w-full h-64 bg-slate-900 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="hitam" className="text-[10px] bg-slate-950/80 backdrop-blur-sm">
                          {member.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pt-4 pb-2">
                      <CardTitle className="text-lg text-white">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-hitam-400 font-semibold">
                        {member.role}
                      </CardDescription>
                      <span className="text-[11px] text-slate-400 block pt-0.5">
                        {member.department}
                      </span>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-800/60 mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      EDC HITAM
                    </span>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
