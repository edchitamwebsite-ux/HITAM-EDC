-- ============================================================================
-- EDC HITAM PLATFORM — COMPLETE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target Engine: Supabase / PostgreSQL 15+
-- Project Reference: kxsinhfsjmqrfkmoqelw
-- Author: EDC HITAM Architecture & Engineering Team
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'attendee',
        'founder',
        'mentor',
        'judge',
        'campus_ambassador',
        'faculty_advisor',
        'admin'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE startup_sector AS ENUM (
        'AgriTech',
        'CleanTech_Hardware',
        'AI_SaaS',
        'DeepTech',
        'HealthTech',
        'BioTech_Robotics',
        'EdTech',
        'FinTech',
        'Consumer_D2C'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE startup_stage AS ENUM (
        'Ideation',
        'Problem_Validated',
        'MVP_Built',
        'Early_Traction',
        'Pre_Seed',
        'Seed_Funded',
        'Series_A_Plus'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_category AS ENUM (
        'Flagship_Conclave',
        'Hackathon',
        'Ideathon',
        'Pitch_Showdown',
        'Workshop_Bootcamp',
        'Keynote_Fireside',
        'Industrial_Visit',
        'Internship_Expo'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM (
        'Draft',
        'Published',
        'Live_Ongoing',
        'Completed',
        'Cancelled',
        'Archived'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM (
        'Pending',
        'Confirmed',
        'Waitlisted',
        'Rejected',
        'Cancelled',
        'Attended'
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. USERS & PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- References auth.users(id)
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'attendee',
    college_name VARCHAR(255) NOT NULL DEFAULT 'HITAM',
    department VARCHAR(100),
    graduation_year INT CHECK (graduation_year BETWEEN 2020 AND 2035),
    linkedin_url TEXT,
    github_url TEXT,
    avatar_url TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    is_hitam_student BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. EVENTS & CONCLAVES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    tagline VARCHAR(255),
    category event_category NOT NULL,
    description TEXT NOT NULL,
    about TEXT,
    banner_url TEXT,
    poster_url TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    venue VARCHAR(255) NOT NULL DEFAULT 'HITAM Green Campus Arena',
    location VARCHAR(255) DEFAULT 'Medchal, Hyderabad',
    max_registrations INT NOT NULL DEFAULT 500,
    current_registrations INT NOT NULL DEFAULT 0,
    prize_pool_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    is_team_event BOOLEAN NOT NULL DEFAULT TRUE,
    min_team_size INT NOT NULL DEFAULT 1,
    max_team_size INT NOT NULL DEFAULT 4,
    registration_fee_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status event_status NOT NULL DEFAULT 'Published',
    registration_open BOOLEAN NOT NULL DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ NOT NULL,
    waitlist_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    require_approval BOOLEAN NOT NULL DEFAULT FALSE,
    eligibility_criteria TEXT,
    rules TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    coordinators TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. EVENT REGISTRATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    team_name VARCHAR(150),
    team_members JSONB DEFAULT '[]'::jsonb,
    registration_code VARCHAR(50) NOT NULL UNIQUE,
    qr_token TEXT NOT NULL,
    status registration_status NOT NULL DEFAULT 'Confirmed',
    form_answers JSONB DEFAULT '{}'::jsonb,
    amount_paid_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_reference_id VARCHAR(150),
    attendance_marked BOOLEAN NOT NULL DEFAULT FALSE,
    attendance_marked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- ============================================================================
-- 5. REUSABLE ANNOUNCEMENTS & POPUP ENGINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    cta_label VARCHAR(100),
    cta_url TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'modal_popup',
    target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
    repeat_policy VARCHAR(50) NOT NULL DEFAULT 'once_ever',
    version INT NOT NULL DEFAULT 1,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcement_dismissals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    dismissed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(announcement_id, user_id, version)
);

-- ============================================================================
-- 6. STARTUPS & INCUBATION COHORTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.startups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL UNIQUE,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    problem TEXT,
    solution TEXT,
    target_audience TEXT,
    sector startup_sector NOT NULL DEFAULT 'AgriTech',
    stage startup_stage NOT NULL DEFAULT 'Ideation',
    founded_year INT DEFAULT 2024,
    founder_names TEXT[] NOT NULL,
    co_founders_count INT DEFAULT 1,
    traction_metric TEXT,
    funding_raised_inr NUMERIC(15, 2) DEFAULT 0.00,
    deck_url TEXT,
    bmc_url TEXT,
    logo_url TEXT,
    website_url TEXT,
    github_url TEXT,
    is_incubated BOOLEAN NOT NULL DEFAULT FALSE,
    incubation_cohort VARCHAR(100),
    lab_allocated VARCHAR(100),
    skills_needed TEXT[] DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'Under_Review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_dismissals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users are readable by authenticated users"
    ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE USING (auth.uid() = auth_id);

-- Events RLS
CREATE POLICY "Published events are viewable by anyone"
    ON public.events FOR SELECT USING (true);

CREATE POLICY "Admins can perform all actions on events"
    ON public.events FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin')
    );

-- Event Registrations RLS
CREATE POLICY "Students can view their own registrations"
    ON public.event_registrations FOR SELECT USING (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Students can register for events"
    ON public.event_registrations FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Admins can update any registration status"
    ON public.event_registrations FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin')
    );

-- Announcements RLS
CREATE POLICY "Active announcements are viewable by anyone"
    ON public.announcements FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full control over announcements"
    ON public.announcements FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin')
    );

-- Startups RLS
CREATE POLICY "Published startups are viewable by anyone"
    ON public.startups FOR SELECT USING (true);

CREATE POLICY "Founders can register new startups"
    ON public.startups FOR INSERT WITH CHECK (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    );

CREATE POLICY "Founders or Admins can update startups"
    ON public.startups FOR UPDATE USING (
        user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND role = 'admin')
    );

-- ============================================================================
-- SEED INITIAL DATA: FLAGSHIP CONCLAVES & ANNOUNCEMENT
-- ============================================================================

INSERT INTO public.events (
    id, title, slug, tagline, category, description, about, banner_url, poster_url,
    start_time, end_time, venue, location, max_registrations, current_registrations,
    prize_pool_inr, is_team_event, min_team_size, max_team_size, status,
    registration_open, registration_deadline, is_featured
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Concept Fusion 2026',
    'concept-fusion-2026',
    'HITAM Flagship Innovation & Multidisciplinary Conclave',
    'Flagship_Conclave',
    'Telangana premier inter-collegiate innovation festival bringing together developers, designers, and aspiring founders.',
    'Concept Fusion is the hallmark annual gathering organized by EDC HITAM. 3 days of intensive building, mentorship clinics, and live pitch showdowns.',
    '/images/events/ConceptFusion-headerbanner.png',
    '/images/events/ConceptFusion-Poster.jpeg',
    '2026-11-20 09:00:00+05:30',
    '2026-11-22 18:00:00+05:30',
    'HITAM Green Campus Arena & Convention Labs',
    'Medchal, Hyderabad, Telangana 501401',
    450, 382, 250000.00, true, 1, 4, 'Published', true, '2026-11-15 23:59:00+05:30', true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.announcements (
    id, event_id, title, message, image_url, cta_label, cta_url, type, is_active, is_urgent
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Concept Fusion 2026 Registrations Open!',
    'HITAM Flagship Multidisciplinary Conclave is now accepting team registrations. ₹2,50,000 in cash prizes, maker bay access, and angel reviews.',
    '/images/events/ConceptFusion-Poster.jpeg',
    'Register for Concept Fusion',
    '/events/concept-fusion-2026',
    'modal_popup',
    true,
    false
) ON CONFLICT DO NOTHING;
