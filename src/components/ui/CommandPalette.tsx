'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Calendar, 
  Rocket, 
  Sparkles, 
  Compass, 
  Award, 
  Users, 
  ArrowRight, 
  X,
  ShieldCheck,
  Building
} from 'lucide-react';
import { FEATURED_EVENTS, INCUBATED_STARTUPS, OPPORTUNITIES } from '@/lib/data';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pages' | 'Events' | 'Startups' | 'Opportunities';
  url: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const router = useRouter();

  // Listen for Ctrl+K or Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for custom trigger event
  React.useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('open_command_palette', handleTrigger);
    return () => window.removeEventListener('open_command_palette', handleTrigger);
  }, []);

  // Build searchable index
  const allItems: SearchItem[] = React.useMemo(() => {
    const pages: SearchItem[] = [
      { id: 'p-home', title: 'Home', subtitle: 'Official EDC HITAM homepage & overview', category: 'Pages', url: '/' },
      { id: 'p-about', title: 'About Us', subtitle: 'Mission, vision, leadership & makerspaces', category: 'Pages', url: '/about' },
      { id: 'p-events', title: 'All Events & Conclaves', subtitle: 'Browse hackathons, summits & workshops', category: 'Pages', url: '/events' },
      { id: 'p-startups', title: 'Startup Hub', subtitle: 'Incubated student ventures & co-founder search', category: 'Pages', url: '/startups' },
      { id: 'p-submit', title: 'Submit Startup Idea', subtitle: 'Apply for catalyst cohort & makerspace bays', category: 'Pages', url: '/startups/submit' },
      { id: 'p-opps', title: 'Funding & Opportunities', subtitle: 'Grants, T-Hub cohorts & patent filing', category: 'Pages', url: '/opportunities' },
      { id: 'p-community', title: 'Community & Mentors', subtitle: 'Founder networks, discussion hubs & clubs', category: 'Pages', url: '/community' },
      { id: 'p-team', title: 'Secretariat & Team', subtitle: 'Faculty coordinators & student leaders', category: 'Pages', url: '/team' },
      { id: 'p-contact', title: 'Contact Desk', subtitle: 'Inquiries, partnerships & campus location', category: 'Pages', url: '/contact' },
      { id: 'p-dash', title: 'Student Dashboard', subtitle: 'My event passes, blueprints & alerts', category: 'Pages', url: '/dashboard' },
      { id: 'p-admin', title: 'Super Admin Command Center', subtitle: 'Participant rosters, switches & moderation', category: 'Pages', url: '/admin' },
    ];

    const events: SearchItem[] = FEATURED_EVENTS.map((e) => ({
      id: `ev-${e.id}`,
      title: e.title,
      subtitle: `${e.category} • ${e.venue}`,
      category: 'Events',
      url: `/events/${e.slug}`,
    }));

    const startups: SearchItem[] = INCUBATED_STARTUPS.map((s) => ({
      id: `st-${s.id}`,
      title: s.name,
      subtitle: `${s.sector} • ${s.stage} (${s.lab_allocated})`,
      category: 'Startups',
      url: '/startups',
    }));

    const opps: SearchItem[] = OPPORTUNITIES.map((o) => ({
      id: `op-${o.id}`,
      title: o.title,
      subtitle: `${o.type} • ${o.provider}`,
      category: 'Opportunities',
      url: '/opportunities',
    }));

    return [...pages, ...events, ...startups, ...opps];
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-navy-950/70 backdrop-blur-sm animate-fade-in flex items-start justify-center">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="h-5 w-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, startups, grants, team, pages... (ESC to close)"
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-300 rounded shadow-sm">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">No matching records found in EDC registry</p>
              <p className="text-[11px] text-slate-400 mt-1">Try searching for &quot;Concept Fusion&quot;, &quot;AgroSensing&quot;, or &quot;Grants&quot;</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                    {item.category === 'Events' && <Calendar className="h-4 w-4" />}
                    {item.category === 'Startups' && <Rocket className="h-4 w-4" />}
                    {item.category === 'Opportunities' && <Award className="h-4 w-4" />}
                    {item.category === 'Pages' && <Compass className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-navy-900 truncate group-hover:text-teal-700">
                        {item.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-navy-900 shrink-0 ml-3 transition-colors" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Ctrl+K</kbd> anywhere to search</span>
          <span>EDC HITAM Global Directory</span>
        </div>
      </div>
    </div>
  );
}
