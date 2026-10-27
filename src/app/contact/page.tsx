'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Send, 
  Globe, 
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('General Inquiry');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            Connect with the Cell
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact EDC HITAM
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Whether you are a student founder seeking makerspace access, an industry leader proposing mentorship, or an investor scouting talent, reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Information & Physical Campus */}
            <div className="lg:col-span-5 space-y-6">
              
              <Card className="border-slate-800 bg-slate-900/60 p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Secretariat & Lab Desk</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Entrepreneurship Development Cell, Innovation Block
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-hitam-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Campus Address</span>
                      <span>
                        Hyderabad Institute of Technology and Management (HITAM)<br />
                        Gowdavelly, Medchal, Hyderabad, Telangana 501401
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-hitam-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Official Email</span>
                      <a href="mailto:edc.hitam.website@hitam.org" className="text-hitam-400 hover:underline">
                        edc.hitam.website@hitam.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Operating Hours</span>
                      <span>Monday – Saturday: 9:00 AM – 5:00 PM IST<br />(24/7 during Hackathons)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <a
                    href="https://maps.google.com/?q=HITAM+Hyderabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 justify-center">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
              </Card>

            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-12 space-y-4 animate-scale-in">
                    <div className="inline-flex p-3 rounded-full bg-hitam-950 border border-hitam-500/40 text-hitam-400">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Transmitted</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you for contacting EDC HITAM. The student executive desk will reply to <strong>{email}</strong> within 24 business hours.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="text-xs">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Direct Message</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Submit your query, sponsorship offer, or speaking proposal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Candidate / Founder / Mentor"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Topic / Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Makerspace Access">Makerspace & Lab Access</option>
                        <option value="Event Participation">Event & Registration Support</option>
                        <option value="Mentorship & VC">VC & Mentorship Collaboration</option>
                        <option value="Sponsorship">Corporate Sponsorship & Conclave Partner</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Your Message *</label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="text-xs px-6 gap-2">
                        <Send className="h-3.5 w-3.5" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
