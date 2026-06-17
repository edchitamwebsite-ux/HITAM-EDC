// ==========================================================================
// EDC HITAM Master Relational Store Emulator & Persistent Cache Seed Engine
// ==========================================================================

const initialBlogs = [
    { id: 11, title: "Welcoming the 2026 Academic Innovation Cohort", date: "2026-06-15", content: "Today marks the launch of our upgraded incubation tracks at the Hyderabad Institute of Technology and Management. The EDC welcomes incoming undergraduate engineering teams eager to tackle User Defined Problems (UDP) and establish scalable commercial paradigms.", author: "Blog Admin", tags: "Incubation, Cohort" },
    { id: 12, title: "National Innovation Week Launch Preparations", date: "2026-01-10", content: "Aligning with MoE Innovation Cell guidelines, our student coordinators are finalizing timelines for upcoming pitching rounds, expert validation sessions, and prototype matching tracks.", author: "Super Admin", tags: "IIC, MoE, Preparation" }
];

const initialTeam = [
    { id: 21, year: 2026, name: "Aasrith Satya", role: "Student Dean (R&D)", achievement: "Secured external funding for skin-conductance prototype models.", linkedin: "https://linkedin.com", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
    { id: 22, year: 2026, name: "Akshita Thakur", role: "Student Coordinator", achievement: "Managed multi-disciplinary pitching rounds tracking 55+ student innovations.", linkedin: "https://linkedin.com", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" },
    { id: 23, year: 2025, name: "Anand Praveen Kumar", role: "Student Dean", achievement: "Established industry network partnerships with regional manufacturing units.", linkedin: "https://linkedin.com", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
    { id: 24, year: 2024, name: "Praveen Kumar", role: "Student Lead (IIIC & EDC)", achievement: "Coordinated structural development layouts for campus pre-incubation units.", linkedin: "https://linkedin.com", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
];

const initialEvents = [
    { id: 31, type: "tours", title: "Exposure Visit to NSIC Hyderabad", date: "2021-09-29", speaker: "T. Muthukumaran (Dy Manager - Tech)", outcome: "50 engineering students evaluated automated manufacturing setups, solar equipment arrays, and electric vehicle architectures.", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" },
    { id: 32, type: "tours", title: "Field Exposure Trip to VVE Transformers", date: "2021-11-17", speaker: "Internal Faculty Leads", outcome: "Students studied real-world manufacturing workflows, oil tanks, and radiator systems.", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80" },
    { id: 33, type: "workshops", title: "Business Model Canvas (BMC) Workshop", date: "2022-03-08", speaker: "Mr. Madan Harathi (Dean - Careers)", outcome: "64 participants mapped value proposition layouts using real startup case studies.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80" },
    { id: 34, type: "pitching", title: "IIC Scouted Idea Pitching Rounds", date: "2022-01-08", speaker: "Dr. Sreeramulu M & Mr. Santosh Naik", outcome: "Student teams presented engineering concepts evaluated on novelty and financial viability metrics.", img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80" }
];

const initialVisitors = [
    {
        id: 41,
        name: "Dr. T.P. Sasi Kumar",
        designation: "Former Deputy Director & Space Scientist",
        org: "Directorate General of Security, Govt of India",
        date: "2021-09-18",
        topic: "Being Better as an Entrepreneur or Job Seeker",
        message: "HITAM's focus on 'Doing Engineering the Experiential Way' builds highly innovative mindsets. It was a pleasure interacting with their student ecosystem!",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&].jpg"
    }
];

const initialStartups = [
    { id: 51, name: "Trendy Jutes", founder: "Manchu Deepa", industry: "Sustainable Materials", solution: "Eco-friendly jute bag distribution networks built via local automated manufacturing channels.", metrics: "Scaled commercial revenues to target threshold of 50 Lakhs.", url: "https://google.com" }
];

const defaultStats = { initiatives: 26, mindsets: 1200, workshops: 45, experts: 32, funding: 15, awards: 12 };

const defaultSocials = {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    website: "https://hitam.org"
};

const defaultProblemVideos = [
    { id: 91, title: "Smart City Traffic Congestion Problem Statement", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", desc: "User-Defined Problem regarding vehicle routing efficiency in heavy urban grid zones." }
];

function fetchTable(key, template) {
    const data = localStorage.getItem(key);
    if (!data || data === "[]" || data === "{}") {
        localStorage.setItem(key, JSON.stringify(template));
        return template;
    }
    return JSON.parse(data);
}

function commitTable(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let db_blogs = fetchTable('edc_blogs', initialBlogs);
let db_team = fetchTable('edc_team', initialTeam);
let db_events = fetchTable('edc_events', initialEvents);
let db_visitors = fetchTable('edc_visitors', initialVisitors);
let db_startups = fetchTable('edc_startups', initialStartups);
let db_stats = fetchTable('edc_site_stats', defaultStats);
let db_applications = fetchTable('edc_applications', []);
let db_socials = fetchTable('edc_site_socials', defaultSocials);
let db_videos = fetchTable('edc_problem_videos', defaultProblemVideos);
let db_logs = fetchTable('edc_admin_audit_logs', []);