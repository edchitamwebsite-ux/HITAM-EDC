import Link from 'next/link';
import Image from 'next/image';
import { 
  Compass, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Instagram, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-hitam-950 border border-hitam-500/40 p-1 flex items-center justify-center">
                <Image
                  src="/images/brand/edc-logo.png"
                  alt="EDC Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Entrepreneurship Development Cell
                </span>
                <span className="text-xs text-hitam-400 font-medium">
                  HITAM Hyderabad
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering student founders and innovators through experiential learning, venture mentorship, maker labs, and seed capital access at the Hyderabad Institute of Technology and Management.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                NAAC A+ Accredited
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                Autonomous Institution
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-hitam-400">
                T-Hub Ecosystem Partner
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events" className="hover:text-hitam-400 transition-colors">
                  Flagship Events & Conclaves
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-hitam-400 transition-colors">
                  Student Startup Directory
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-hitam-400 transition-colors">
                  Grants & Competitions
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-hitam-400 transition-colors">
                  Founder Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-hitam-400 transition-colors">
                  Our Mission & Vision
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programs & Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/events/concept-fusion" className="hover:text-hitam-400 transition-colors">
                  Concept Fusion
                </Link>
              </li>
              <li>
                <Link href="/events/e-summit" className="hover:text-hitam-400 transition-colors">
                  Annual E-Summit
                </Link>
              </li>
              <li>
                <Link href="/startups/submit" className="hover:text-hitam-400 transition-colors">
                  Idea Validation Camp
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-hitam-400 transition-colors">
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Campus & Contact</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-hitam-400 shrink-0 mt-0.5" />
                <span>
                  HITAM Campus, Gowdavelly, Medchal, Hyderabad, Telangana 501401
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-hitam-400 shrink-0" />
                <a href="mailto:edc.hitam.website@hitam.org" className="hover:text-white transition-colors">
                  edc.hitam.website@hitam.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-hitam-400 shrink-0" />
                <a href="https://hitam.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  hitam.org <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-white transition-colors"
                aria-label="EDC HITAM LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 hover:text-white transition-colors"
                aria-label="EDC HITAM Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Entrepreneurship Development Cell (EDC), HITAM. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
