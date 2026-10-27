export type UserRole = 'attendee' | 'founder' | 'mentor' | 'judge' | 'campus_ambassador' | 'faculty_advisor' | 'admin';

export interface UserProfile {
  id: string;
  auth_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  college_name: string;
  department?: string;
  graduation_year?: number;
  linkedin_url?: string;
  github_url?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  is_hitam_student: boolean;
  created_at: string;
  updated_at: string;
}

export type EventCategory = 
  | 'Flagship_Conclave'
  | 'Hackathon'
  | 'Ideathon'
  | 'Pitch_Showdown'
  | 'Workshop_Bootcamp'
  | 'Keynote_Fireside'
  | 'Industrial_Visit'
  | 'Internship_Expo';

export type EventStatus = 
  | 'Draft'
  | 'Published'
  | 'Live_Ongoing'
  | 'Completed'
  | 'Cancelled'
  | 'Archived';

export type RegistrationAvailability = 
  | 'Open'
  | 'Closed'
  | 'Paused'
  | 'Waitlist_Only'
  | 'Upcoming';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  category: EventCategory;
  description: string;
  about?: string;
  banner_url?: string;
  poster_url?: string;
  start_time: string;
  end_time: string;
  venue: string;
  location?: string;
  max_registrations: number;
  current_registrations: number;
  prize_pool_inr: number;
  is_team_event: boolean;
  min_team_size: number;
  max_team_size: number;
  registration_fee_inr: number;
  status: EventStatus;
  registration_open: boolean;
  registration_deadline: string;
  waitlist_enabled: boolean;
  require_approval: boolean;
  eligibility_criteria?: string;
  rules?: string;
  faqs?: Array<{ question: string; answer: string }>;
  coordinators?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'url'
  | 'file';

export interface FormFieldDefinition {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select, radio, checkbox
  help_text?: string;
  validation_regex?: string;
  min_length?: number;
  max_length?: number;
}

export interface DynamicRegistrationForm {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  fields: FormFieldDefinition[];
  created_at: string;
  updated_at: string;
}

export type RegistrationStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Waitlisted'
  | 'Rejected'
  | 'Cancelled'
  | 'Attended';

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  team_name?: string;
  team_members?: Array<{ name: string; email: string; phone?: string; college?: string }>;
  registration_code: string;
  qr_token: string;
  status: RegistrationStatus;
  form_answers: Record<string, any>;
  amount_paid_inr: number;
  payment_reference_id?: string;
  attendance_marked: boolean;
  attendance_marked_at?: string;
  created_at: string;
  updated_at: string;
  // Joined fields for display
  event?: EventItem;
  user?: UserProfile;
}

export type AnnouncementType = 
  | 'modal_popup'
  | 'top_banner'
  | 'urgent_alert';

export type RepeatPolicy = 
  | 'once_ever'
  | 'once_per_session'
  | 'always_until_dismissed'
  | 'on_version_update';

export interface Announcement {
  id: string;
  event_id?: string;
  title: string;
  message: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
  type: AnnouncementType;
  target_audience: 'all' | 'students_only' | 'founders_only';
  repeat_policy: RepeatPolicy;
  version: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_urgent: boolean;
  created_at: string;
  updated_at: string;
  event?: EventItem;
}

export interface AnnouncementDismissal {
  id: string;
  announcement_id: string;
  user_id?: string;
  client_fingerprint?: string;
  version: number;
  dismissed_at: string;
}

export type StartupSector = 
  | 'AgriTech'
  | 'CleanTech_Hardware'
  | 'AI_SaaS'
  | 'DeepTech'
  | 'EdTech'
  | 'FinTech'
  | 'HealthTech'
  | 'BioTech_Robotics'
  | 'Consumer_D2C';

export type StartupStage = 
  | 'Ideation'
  | 'Problem_Validated'
  | 'MVP_Built'
  | 'Early_Traction'
  | 'Pre_Seed'
  | 'Seed_Funded'
  | 'Series_A_Plus';

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  tagline: string;
  description: string;
  sector: StartupSector;
  stage: StartupStage;
  founded_year: number;
  founder_names: string[];
  co_founders_count: number;
  traction_metric?: string;
  funding_raised_inr: number;
  deck_url?: string;
  bmc_url?: string;
  logo_url?: string;
  website_url?: string;
  github_url?: string;
  is_incubated: boolean;
  incubation_cohort?: string;
  lab_allocated?: string;
  skills_needed?: string[];
  status: 'Draft' | 'Published' | 'Under_Review';
  created_at: string;
  updated_at: string;
  founder?: UserProfile;
}

export interface CollaborationRequest {
  id: string;
  startup_id: string;
  requester_id: string;
  role_applied: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
  startup?: Startup;
  requester?: UserProfile;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'General' | 'Ideation' | 'Tech_Stack' | 'Co_Founder_Hunt' | 'Funding' | 'Feedback';
  tags: string[];
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
}

export interface OpportunityItem {
  id: string;
  title: string;
  organization: string;
  category: 'Hackathon' | 'Incubation' | 'Grant' | 'Competition' | 'Fellowship';
  deadline: string;
  grant_or_prize: string;
  location: string;
  link_url: string;
  description: string;
  eligibility: string;
}

export interface AdminAuditLog {
  id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  payload?: any;
  created_at: string;
  actor?: UserProfile;
}
