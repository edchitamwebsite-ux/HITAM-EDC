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
    if (!name || !email || !message) return;

    setIsSubmitting(true);

    const inquiryPayload = {
      id: `inq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
      status: 'New',
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('edc_inquiries') || '[]');
      existing.unshift(inquiryPayload);
      localStorage.setItem('edc_inquiries', JSON.stringify(existing));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16">
      
      {/* Header */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="teal" className="mb-3">
            Connect with the Cell
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy-900 tracking-tight font-heading">
            Contact EDC HITAM
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Whether you are a student founder seeking makerspace access, an industry leader proposing mentorship, or an investor scouting talent, reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Information & Physical Campus */}
            <div className="lg:col-span-5 space-y-6">
              
              <Card className="border-slate-200 bg-white shadow-card p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-navy-900 font-heading">Secretariat & Lab Desk</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Entrepreneurship Development Cell, Innovation Block
                  </p>
                </div>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-900 block">Campus Address</span>
                      <span>
                        Hyderabad Institute of Technology and Management (HITAM)<br />
                        Gowdavelly, Medchal, Hyderabad, Telangana 501401
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-900 block">Official Email</span>
                      <a href="mailto:edc.hitam.website@hitam.org" className="text-teal-700 font-medium hover:underline">
                        edc.hitam.website@hitam.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-900 block">Operating Hours</span>
                      <span>Monday – Saturday: 9:00 AM – 5:00 PM IST<br />(24/7 during Hackathons)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
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
              <Card className="border-slate-200 bg-white shadow-card p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="inline-flex p-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900 font-heading">Message Transmitted</h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                      Thank you for contacting EDC HITAM. The student executive desk will reply to <strong>{email}</strong> within 24 business hours.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="text-xs">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy-900 font-heading">Direct Message</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Submit your query, sponsorship offer, or speaking proposal.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Arun Kumar"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. arun@gmail.com"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Topic / Category</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Event Registration Assistance">Event Registration Assistance</option>
                        <option value="Startup Incubation / Bay Space">Startup Incubation / Bay Space</option>
                        <option value="Corporate Sponsorship & Partnerships">Corporate Sponsorship & Partnerships</option>
                        <option value="Guest Speaker / Workshop Proposal">Guest Speaker / Workshop Proposal</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Message *</label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please write your detailed inquiry or proposal..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button 
                        type="submit" 
                        variant="navy" 
                        size="md" 
                        isLoading={isSubmitting}
                        className="text-xs px-6 gap-2"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Send Official Inquiry
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
