'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FEATURED_EVENTS } from '@/lib/data';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Search, 
  ArrowRight
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
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="teal" className="mb-3">
            EDC Conclaves & Competitions
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight font-heading">
            Events & Innovation Sprints
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover upcoming hackathons, pitch showdowns, maker bootcamps, and Telangana premier student conclaves organized by EDC HITAM.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
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
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by title, track, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900 shadow-subtle"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-card">
              <Calendar className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy-900 font-heading">No Events Found</h3>
              <p className="mt-1 text-xs text-slate-500">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const deadlineDate = new Date(event.registration_deadline);
                const isDeadlinePassed = new Date() > deadlineDate;
                const isFull = event.current_registrations >= event.max_registrations;

                return (
                  <Card key={event.id} className="border-slate-200 institutional-card flex flex-col justify-between overflow-hidden">
                    <div>
                      {/* Event Banner */}
                      <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                        <Image
                          src={event.poster_url || event.banner_url || '/images/events/ConceptFusion-headerbanner.png'}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <Badge variant="navy" className="text-[10px] bg-white/95 backdrop-blur-sm shadow-subtle">
                            {event.category.replace('_', ' ')}
                          </Badge>
                          {event.is_featured && (
                            <Badge variant="amber" className="text-[10px] shadow-subtle">
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Availability Pill */}
                        <div className="absolute bottom-3 right-3">
                          {event.registration_open && !isDeadlinePassed && !isFull ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-subtle">
                              Registration Open
                            </span>
                          ) : isFull ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-subtle">
                              Waitlist Only
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700 text-white shadow-subtle">
                              Registration Closed
                            </span>
                          )}
                        </div>
                      </div>

                      <CardHeader className="pt-4 pb-2">
                        <CardTitle className="text-xl text-navy-900 leading-snug">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-teal-700 font-semibold">
                          {event.tagline}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        <div className="pt-2 space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span>{new Date(event.start_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            <span>Prize Pool: ₹{event.prize_pool_inr.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="pt-2 space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                            <span>Capacity</span>
                            <span>{event.current_registrations} / {event.max_registrations} enrolled</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-teal-600 rounded-full"
                              style={{ width: `${Math.min(100, (event.current_registrations / event.max_registrations) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-500 block text-[10px] font-medium">Entry Fee:</span>
                        <span className="font-bold text-navy-900">
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
