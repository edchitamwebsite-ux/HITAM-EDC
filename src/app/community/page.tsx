'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Heart, 
  Sparkles, 
  Plus, 
  Tag, 
  Share2,
  Clock,
  UserCheck
} from 'lucide-react';

interface Post {
  id: string;
  author: string;
  role: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Arun Kumar',
    role: 'Founder @ CogniFlow AI (HITAM 26)',
    category: 'Co_Founder_Hunt',
    title: 'Looking for an Embedded Firmware Engineer for industrial edge camera node',
    content: 'We are prototyping an on-premise industrial inspection node using ESP32-S3 and TinyML. Need a classmate who knows C/FreeRTOS and hardware serial interfaces. We have bay space allocated in HITAM Makerspace Bay 3.',
    tags: ['ESP32', 'FreeRTOS', 'Hardware', 'CoFounder'],
    likes: 14,
    comments: 6,
    createdAt: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'Divya Srikanth',
    role: 'SolarGrid Pulse Lead (HITAM 25)',
    category: 'Funding',
    title: 'TSIC Student Catalyst Grant application review session',
    content: 'Dr. Sheela Singh will be conducting a live grant draft review this Thursday at 4 PM in the EDC conference room. If you are preparing an application for the rural innovation grant, bring 2 hard copies of your budget breakdown.',
    tags: ['TSIC', 'Grants', 'Mentorship'],
    likes: 22,
    comments: 9,
    createdAt: '5 hours ago'
  },
  {
    id: 'post-3',
    author: 'Shaik Rehan',
    role: 'Student Coordinator — EDC HITAM',
    category: 'Ideation',
    title: 'Concept Fusion 2026 track briefing & mentor pairing office hours',
    content: 'Registrations for Concept Fusion have officially crossed 380! We are setting up track-specific Discord and WhatsApp channels for registered delegates. Check your inbox for mentor matching schedules.',
    tags: ['ConceptFusion', 'Conclave', 'Announcements'],
    likes: 38,
    comments: 12,
    createdAt: '1 day ago'
  }
];

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<Post[]>(INITIAL_POSTS);
  const [selectedCat, setSelectedCat] = React.useState<string>('All');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  // New Post Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newAuthor, setNewAuthor] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('Ideation');
  const [newContent, setNewContent] = React.useState('');
  const [newTags, setNewTags] = React.useState('');

  const categories = ['All', 'Co_Founder_Hunt', 'Ideation', 'Tech_Stack', 'Funding', 'Feedback'];

  const filtered = posts.filter((post) => {
    const matchesCat = selectedCat === 'All' || post.category === selectedCat;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent || !newAuthor) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: newAuthor,
      role: 'Student Innovator (HITAM)',
      category: newCategory,
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      likes: 1,
      comments: 0,
      createdAt: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setNewTags('');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <section className="py-20 border-b border-slate-800 bg-grid-pattern">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="hitam" className="mb-4">
            HITAM Student Innovation Forum
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Founder & Builder Community
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Find co-founders, post technical road blocks, share grant tips, and collaborate across disciplines with fellow HITAM innovators.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => setIsModalOpen(true)} className="gap-2 shadow-glow-sm">
              <Plus className="h-4 w-4" />
              Start a Discussion
            </Button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCat === cat
                    ? 'bg-hitam-600 text-white shadow-sm border border-hitam-400/40'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search community posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-hitam-400"
            />
          </div>

        </div>
      </section>

      {/* Feed */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {filtered.map((post) => (
            <Card key={post.id} className="border-slate-800 glass-panel-hover p-6 space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-hitam-950 border border-hitam-500/40 flex items-center justify-center font-bold text-hitam-400 text-xs">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">{post.author}</span>
                    <span className="text-[11px] text-slate-400">{post.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="hitam" className="text-[10px]">
                    {post.category.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] text-slate-500">{post.createdAt}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-hitam-300 border border-slate-700/60 flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <span>{post.comments} Responses</span>
                </div>
              </div>

            </Card>
          ))}

        </div>
      </section>

      {/* New Post Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
      >
        <div>
          <div className="mb-4">
            <Badge variant="hitam" className="mb-1 text-[10px]">Community Forum</Badge>
            <h3 className="text-xl font-bold text-white">Create a Discussion Post</h3>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                >
                  <option value="Ideation">Ideation</option>
                  <option value="Co_Founder_Hunt">Co-Founder Hunt</option>
                  <option value="Tech_Stack">Tech Stack</option>
                  <option value="Funding">Funding & Grants</option>
                  <option value="Feedback">Product Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. AI, Hardware, Python"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Post Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Clear headline for your discussion..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Content / Details *</label>
              <textarea
                rows={4}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe your question, project status, or opportunity..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-hitam-400"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="text-xs">
                Publish Post
              </Button>
            </div>
          </form>
        </div>
      </Modal>

    </div>
  );
}
