import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementPopup } from '@/components/events/AnnouncementPopup';
import { AnnouncementBanner } from '@/components/events/AnnouncementBanner';
import { CommandPalette } from '@/components/ui/CommandPalette';

export const metadata: Metadata = {
  title: {
    default: 'EDC HITAM — Entrepreneurship Development Cell | Hyderabad',
    template: '%s | EDC HITAM',
  },
  description:
    'Official innovation and entrepreneurship ecosystem at Hyderabad Institute of Technology and Management (HITAM). Ideation sprints, maker labs, startup incubation, flagship conclaves, and venture funding.',
  keywords: [
    'EDC HITAM',
    'HITAM Hyderabad',
    'Student Startups',
    'Entrepreneurship Development Cell',
    'Concept Fusion',
    'E-Summit HITAM',
    'Incubation Hyderabad',
    'T-Hub Partner',
  ],
  authors: [{ name: 'EDC HITAM Team' }],
  creator: 'Entrepreneurship Development Cell, HITAM',
  metadataBase: new URL('https://www.edchitam.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.edchitam.com',
    siteName: 'EDC HITAM — Hyderabad Institute of Technology and Management',
    title: 'EDC HITAM — Hyderabad Innovation & Entrepreneurship Cell',
    description:
      'Catalyzing engineering student founders, hardware makerspaces, deep-tech research, and patent venture creation at HITAM Green Campus.',
    images: [
      {
        url: '/images/brand/edc-logo.png',
        width: 800,
        height: 600,
        alt: 'EDC HITAM Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDC HITAM — Entrepreneurship Development Cell',
    description:
      'Official student innovation hub of HITAM Hyderabad. Conclaves, hardware makerspaces, and startup cohorts.',
    images: ['/images/brand/edc-logo.png'],
  },
  icons: {
    icon: '/images/brand/edc-logo.png',
    apple: '/images/brand/edc-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-teal-100 selection:text-teal-900">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <AnnouncementPopup />
        <CommandPalette />
      </body>
    </html>
  );
}
