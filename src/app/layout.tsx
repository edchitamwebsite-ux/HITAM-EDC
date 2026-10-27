import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementPopup } from '@/components/events/AnnouncementPopup';
import { AnnouncementBanner } from '@/components/events/AnnouncementBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

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
    title: 'EDC HITAM — Doing Engineering The Experiential Way',
    description:
      'Empowering student founders, innovators, and future industry leaders with mentorship, lab access, and capital.',
    url: 'https://www.edchitam.com',
    siteName: 'EDC HITAM',
    images: [
      {
        url: '/images/brand/edc-logo.png',
        width: 800,
        height: 600,
        alt: 'EDC HITAM Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
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
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} dark`}>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-hitam-500/30 selection:text-hitam-200">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <AnnouncementPopup />
      </body>
    </html>
  );
}
