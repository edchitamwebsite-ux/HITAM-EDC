'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TEAM_MEMBERS } from '@/lib/data';
import { Linkedin, Search } from 'lucide-react';

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
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      
      {/* Page Header */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="navy" className="mb-3">
            Institutional Leadership
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight font-heading">
            The Team Behind EDC HITAM
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Meet the faculty advisors, student innovators, and operations leads orchestrating venture cohorts, makerspace labs, and flagship conclaves.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy-900 text-white shadow-subtle border border-navy-950'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
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
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 shadow-subtle"
            />
          </div>

        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-sm">
              No team members found matching your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="border-slate-200 institutional-card flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Member Portrait */}
                    <div className="relative w-full h-64 bg-slate-100 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="navy" className="text-[10px] bg-white/95 backdrop-blur-sm shadow-subtle">
                          {member.category}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pt-4 pb-2">
                      <CardTitle className="text-lg text-navy-900">
                        {member.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-teal-700 font-semibold">
                        {member.role}
                      </CardDescription>
                      <span className="text-[11px] text-slate-500 block pt-0.5">
                        {member.department}
                      </span>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      HITAM
                    </span>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-navy-900 transition-colors"
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
