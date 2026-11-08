import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Mail, 
  Globe, 
  Linkedin, 
  Instagram, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-subtle">
                <Image
                  src="/images/brand/edc-logo.png"
                  alt="EDC Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight font-heading">
                  Entrepreneurship Development Cell
                </span>
                <span className="text-xs text-teal-400 font-semibold tracking-wide">
                  HITAM Hyderabad
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering student founders and innovators through experiential learning, venture mentorship, maker labs, and seed capital access at the Hyderabad Institute of Technology and Management.
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-navy-900 border border-navy-800 text-slate-300 font-medium">
                NAAC A+ Accredited
              </span>
              <span className="px-2.5 py-1 rounded-md bg-navy-900 border border-navy-800 text-slate-300 font-medium">
                Autonomous Institution
              </span>
              <span className="px-2.5 py-1 rounded-md bg-navy-900 border border-teal-800/60 text-teal-300 font-medium">
                T-Hub Ecosystem Partner
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-teal-400 transition-colors">
                  Flagship Events & Conclaves
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-teal-400 transition-colors">
                  Student Startup Directory
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-teal-400 transition-colors">
                  Grants & Competitions
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-teal-400 transition-colors">
                  Founder Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  Our Mission & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programs & Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events/concept-fusion-2026" className="hover:text-teal-400 transition-colors">
                  Concept Fusion 2026
                </Link>
              </li>
              <li>
                <Link href="/events/hitam-e-summit-2026" className="hover:text-teal-400 transition-colors">
                  Annual E-Summit
                </Link>
              </li>
              <li>
                <Link href="/startups/submit" className="hover:text-teal-400 transition-colors">
                  Idea Validation Camp
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-teal-400 transition-colors">
                  Executive Student Body
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Campus & Contact</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  HITAM Campus, Gowdavelly, Medchal, Hyderabad, Telangana 501401
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <a href="mailto:edc.hitam.website@hitam.org" className="hover:text-white transition-colors">
                  edc.hitam.website@hitam.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-teal-400 shrink-0" />
                <a href="https://hitam.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  hitam.org <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                aria-label="EDC HITAM LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                aria-label="EDC HITAM Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Entrepreneurship Development Cell (EDC), HITAM. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              Institutional Charter
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Support & Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
