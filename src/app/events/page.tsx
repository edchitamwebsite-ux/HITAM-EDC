'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FEATURED_EVENTS } from '@/lib/data';
import { EventItem, EventCategory } from '@/types';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  Filter
} from 'lucide-react';

export default function EventsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const categories: Array<string> = [
    'All',
    'Flagship_Conclave',
    'Pitch_Showdown',
    'Workshop_Bootcamp',
    'Hackathon',
    'Ideathon'
  ];

  const filteredEvents = FEATURED_EVENTS.filter((event) => {
    const matchesCat = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Open' && event.registration_open) ||
      (selectedStatus === 'Closed' && !event.registration_open);
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            EDC Conclaves & Competitions
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Events & Innovation Sprints
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Discover upcoming hackathons, pitch showdowns, maker bootcamps, and Telangana premier student conclaves organized by EDC HITAM.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
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
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by name, track, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 p-8 max-w-lg mx-auto">
              <Calendar className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Events Found</h3>
              <p className="mt-1 text-xs text-slate-400">
                Try selecting another category or clear your search term.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-4 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => {
                const deadlineDate = new Date(event.registration_deadline);
                const isDeadlinePassed = new Date() > deadlineDate;
                const isFull = event.current_registrations >= event.max_registrations;

                return (
                  <Card key={event.id} className="border-slate-800 glass-panel-hover flex flex-col justify-between overflow-hidden">
                    <div>
                      {/* Event Banner */}
                      <div className="relative w-full h-52 bg-slate-900 overflow-hidden">
                        <Image
                          src={event.poster_url || event.banner_url || '/images/events/ConceptFusion-headerbanner.png'}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <Badge variant="hitam" className="text-[10px] bg-slate-950/80 backdrop-blur-sm">
                            {event.category.replace('_', ' ')}
                          </Badge>
                          {event.is_featured && (
                            <Badge variant="amber" className="text-[10px] bg-slate-950/80 backdrop-blur-sm">
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Registration Availability Badge */}
                        <div className="absolute bottom-3 right-3">
                          {event.registration_open && !isDeadlinePassed && !isFull ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white shadow-sm">
                              Registration Open
                            </span>
                          ) : isFull ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/90 text-white shadow-sm">
                              Waitlist Only
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300 shadow-sm">
                              Registration Closed
                            </span>
                          )}
                        </div>
                      </div>

                      <CardHeader className="pt-4 pb-2">
                        <CardTitle className="text-xl text-white leading-snug">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-hitam-300 font-medium">
                          {event.tagline}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1">
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-hitam-400 shrink-0" />
                            <span>{new Date(event.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-hitam-400 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            <span>Prize Pool: ₹{event.prize_pool_inr.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="pt-2 space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Capacity</span>
                            <span>{event.current_registrations} / {event.max_registrations}</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className="h-full bg-hitam-500 rounded-full"
                              style={{ width: `${Math.min(100, (event.current_registrations / event.max_registrations) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-400 block text-[10px]">Fee:</span>
                        <span className="font-bold text-white">
                          {event.registration_fee_inr === 0 ? 'Free' : `₹${event.registration_fee_inr}`}
                        </span>
                      </div>

                      <Link href={`/events/${event.slug}`}>
                        <Button variant="primary" size="sm" className="text-xs gap-1.5">
                          View & Register
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
