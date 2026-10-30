export type JobRoleId = 'supervisor' | 'field-coordinator' | 'community-coordinator'

export interface JobRole {
  id: JobRoleId
  title: string
  reportsTo: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
}

export interface JobCountry {
  code: string
  name: string
  flag: string
  region: string
  focus: string
  languages: string
  /** Checks we will run on shortlisted candidates before any offer. */
  verification: string[]
  /** Local laws the role holder must operate within. */
  laws: string[]
}

export const JOB_ROLES: JobRole[] = [
  {
    id: 'supervisor',
    title: 'Country Supervisor',
    reportsTo: 'Head of Conservation',
    summary:
      'Leads Earth Protect\'s work in the country. You are the accountable lead for programmes, partners, budgets, safeguarding and legal compliance, and you manage the two country coordinators.',
    responsibilities: [
      'Lead and line-manage the Field Operations Coordinator and the Community Coordinator',
      'Build and maintain relationships with the national wildlife authority, local government, landowners and partner NGOs',
      'Plan, budget and report on country programmes, including monthly narrative and financial reports',
      'Ensure all activity complies with national wildlife, labour, tax, data-protection and permit requirements',
      'Own risk management, staff and community safeguarding, and incident reporting',
      'Represent Earth Protect at government, donor and community meetings',
    ],
    requirements: [
      '5+ years in conservation, protected-area management, or NGO programme management, including 2+ years supervising a team',
      'Proven experience working with government wildlife agencies and local communities',
      'Strong budgeting, reporting and record-keeping skills',
      'Fluent in English and the main working language of the country',
      'Legal right to live and work in the country',
      'Willingness to undergo identity, criminal-record and reference checks',
    ],
    niceToHave: [
      'Degree in conservation, ecology, natural resource management or a related field',
      'Experience with donor-funded projects',
      'Knowledge of wildlife-crime reporting and anti-trafficking procedures',
    ],
  },
  {
    id: 'field-coordinator',
    title: 'Field Operations Coordinator',
    reportsTo: 'Country Supervisor',
    summary:
      'Runs the day-to-day field programme: ranger and volunteer support, wildlife monitoring, data collection and incident response, always in line with national law and park rules.',
    responsibilities: [
      'Coordinate patrol support, wildlife monitoring and habitat surveys with authorised partners',
      'Collect, check and submit field data and photo evidence for Earth Protect animal profiles',
      'Report suspected poaching or trafficking to the lawful authority only. Never confront suspects.',
      'Plan logistics, equipment and field-staff schedules; keep equipment and expense records',
      'Run safety briefings and keep field teams within permitted areas and permits',
      'Support field volunteers and onboard them in line with the safeguarding policy',
    ],
    requirements: [
      '3+ years in wildlife monitoring, ranger support, field research or protected-area operations',
      'Comfortable with remote field conditions and long days outdoors',
      'Competent with GPS, camera traps or similar tools, and basic data entry',
      'First-aid training (or willingness to complete it within 3 months)',
      'Valid driving licence',
      'Legal right to live and work in the country, and willingness to undergo identity, criminal-record and reference checks',
    ],
    niceToHave: [
      'Wildlife guiding or ranger qualification',
      'Experience with SMART, EarthRanger or similar patrol-data tools',
      'Local language skills for the project area',
    ],
  },
  {
    id: 'community-coordinator',
    title: 'Community & Outreach Coordinator',
    reportsTo: 'Country Supervisor',
    summary:
      'Builds trust with the communities that live alongside wildlife. You run education, livelihoods and awareness work, and bring local stories to the Earth Protect community online.',
    responsibilities: [
      'Plan and run school, village and youth conservation education sessions',
      'Work with community leaders on human-wildlife conflict prevention and livelihood projects',
      'Recruit, brief and support local volunteers and ambassadors',
      'Collect consented photos, stories and updates for the website and supporter communications',
      'Keep a record of community feedback, grievances and the actions taken',
      'Apply the safeguarding and child-protection policy in all activities',
    ],
    requirements: [
      '3+ years in community development, environmental education, or outreach',
      'Excellent communication and facilitation skills in English and local languages',
      'Experience working with community leaders, schools or local associations',
      'Basic digital skills: email, spreadsheets, and mobile photo or video',
      'Legal right to live and work in the country, and willingness to undergo identity, criminal-record and reference checks (including a child-safeguarding check where the law allows)',
    ],
    niceToHave: [
      'Background in education, social work or communications',
      'Experience with community-based natural resource management',
      'Social media or storytelling experience',
    ],
  },
]

export const JOB_COUNTRIES: JobCountry[] = [
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    focus: 'Savannah ecosystems, elephants, lions and cheetah; community conservancies',
    languages: 'English, Kiswahili',
    verification: [
      'National ID or passport check (valid work permit or pass for non-citizens)',
      'Certificate of Good Conduct from the Directorate of Criminal Investigations',
      'Employment reference checks',
      'Professional qualification and licence verification',
    ],
    laws: [
      'Wildlife Conservation and Management Act, 2013 and Kenya Wildlife Service permits',
      'Employment Act, 2007 and statutory deductions (PAYE, NSSF, SHA)',
      'Data Protection Act, 2019',
    ],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    region: 'Southern Africa',
    focus: 'Rhino protection, anti-poaching support, penguin and coastal conservation',
    languages: 'English (Afrikaans, isiZulu or isiXhosa an advantage)',
    verification: [
      'South African ID or passport check (valid work visa for non-citizens)',
      'SAPS police clearance certificate',
      'Employment reference checks',
      'Qualification verification, and PDP/firearm competency checks only if the role requires them',
    ],
    laws: [
      'National Environmental Management: Biodiversity Act (NEMBA) and provincial nature conservation permits',
      'Basic Conditions of Employment Act and Labour Relations Act',
      'Protection of Personal Information Act (POPIA)',
    ],
  },
  {
    code: 'CD',
    name: 'DR Congo',
    flag: '🇨🇩',
    region: 'Central Africa',
    focus: 'Congo Basin rainforest, great apes (bonobo, gorilla), okapi',
    languages: 'French (required), English; Lingala or Kiswahili an advantage',
    verification: [
      'National ID or passport check (valid work authorisation for non-citizens)',
      'Criminal record extract (extrait de casier judiciaire)',
      'Employment reference checks',
      'Verification of any prior affiliation with protected-area authorities (ICCN) or partner organisations',
    ],
    laws: [
      'Wildlife and protected-area rules administered by the ICCN, including research and access permits',
      'Congolese Labour Code and social-security (INSS) requirements',
      'Applicable data-protection and digital-code provisions',
    ],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'West Africa',
    focus: 'Forest and savannah reserves, pangolin and primate protection, anti-trafficking',
    languages: 'English; Hausa, Yoruba or Igbo an advantage',
    verification: [
      'National Identification Number (NIN) check, or passport and valid permit for non-citizens',
      'Police Character Certificate',
      'Employment reference checks',
      'Qualification verification',
    ],
    laws: [
      'Endangered Species (Control of International Trade and Traffic) Act and state forestry and park rules',
      'Labour Act and statutory pension and tax requirements',
      'Nigeria Data Protection Act, 2023',
    ],
  },
]

export function getRole(id: string): JobRole | undefined {
  return JOB_ROLES.find((r) => r.id === id)
}

export function getCountry(code: string): JobCountry | undefined {
  return JOB_COUNTRIES.find((c) => c.code === code)
}

/** Stored in JoinApplication.role as `job:<COUNTRY>:<role>`. */
export function jobRoleKey(countryCode: string, roleId: string) {
  return `job:${countryCode}:${roleId}`
}

export function describeJobRoleKey(key: string): string | null {
  const [prefix, countryCode, roleId] = key.split(':')
  if (prefix !== 'job') return null
  const country = getCountry(countryCode)
  const role = getRole(roleId)
  if (!country || !role) return null
  return `${role.title} · ${country.name}`
}

/* ── Hiring pipeline ─────────────────────────────────────────────── */

export const APPLICATION_STAGES = [
  { id: 'applied', label: 'Applied', bg: '#dbeafe', color: '#1e40af' },
  { id: 'screening', label: 'Screening', bg: '#fef9c3', color: '#854d0e' },
  { id: 'shortlisted', label: 'Shortlisted · CV requested', bg: '#e0f2fe', color: '#075985' },
  { id: 'interview', label: 'Interview', bg: '#ede9fe', color: '#5b21b6' },
  { id: 'reference_check', label: 'Reference & background checks', bg: '#ffedd5', color: '#9a3412' },
  { id: 'offer', label: 'Offer made', bg: '#cffafe', color: '#155e75' },
  { id: 'hired', label: 'Hired', bg: '#dcfce7', color: '#166534' },
  { id: 'rejected', label: 'Declined', bg: '#fee2e2', color: '#991b1b' },
  { id: 'withdrawn', label: 'Withdrawn', bg: '#f3f4f6', color: '#374151' },
] as const

export type ApplicationStageId = (typeof APPLICATION_STAGES)[number]['id']

export function getStage(id: string) {
  return APPLICATION_STAGES.find((s) => s.id === id) ?? APPLICATION_STAGES[0]
}

/** JoinApplication.status is still used by the members page: keep it in step with the stage. */
export function stageToStatus(stage: string): 'pending' | 'approved' | 'rejected' {
  if (stage === 'hired') return 'approved'
  if (stage === 'rejected' || stage === 'withdrawn') return 'rejected'
  return 'pending'
}

export const CAREERS_EMAIL = 'info@earthprotect.org'

/** Subject line shortlisted candidates should use when emailing their CV. */
export function cvEmailSubject(roleTitle: string, countryName: string) {
  return `CV: ${roleTitle}, ${countryName}`
}

/** Public link that opens the careers page on a specific opening. */
export function jobShareUrl(baseUrl: string, openingId: string) {
  return `${baseUrl.replace(/\/$/, '')}/careers?job=${encodeURIComponent(openingId)}`
}

export const OPENING_STATUSES = [
  { id: 'draft', label: 'Draft (hidden)' },
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
] as const

/* ── Shapes passed from the server to the public careers page ───── */

export interface TimelineEntry {
  date: string
  label: string
}

export interface PublicOpening {
  id: string
  title: string
  reportsTo: string
  employmentType: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  location: string | null
  salary: string | null
  positions: number
  opensAt: string | null
  closesAt: string | null
  timeline: TimelineEntry[]
  /** open | upcoming | closed, worked out from status and dates. */
  availability: 'open' | 'upcoming' | 'closed'
}

export interface PublicCountry {
  code: string
  name: string
  flag: string
  region: string
  focus: string
  languages: string
  verification: string[]
  laws: string[]
  openings: PublicOpening[]
}

export function openingAvailability(
  status: string,
  opensAt: Date | null,
  closesAt: Date | null,
  now = new Date(),
): PublicOpening['availability'] {
  if (status !== 'open') return 'closed'
  if (opensAt && opensAt > now) return 'upcoming'
  if (closesAt && closesAt < now) return 'closed'
  return 'open'
}

/** Textarea helpers: one item per line. */
export function splitLines(value: FormDataEntryValue | null | undefined): string[] {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
}

/** "2026-11-01 | Interviews" per line  ->  [{ date, label }] */
export function parseTimeline(value: FormDataEntryValue | null | undefined): TimelineEntry[] {
  return splitLines(value)
    .map((line) => {
      const [date, ...rest] = line.split('|')
      return { date: date.trim(), label: rest.join('|').trim() }
    })
    .filter((e) => e.date && e.label)
}

export function timelineToText(timeline: unknown): string {
  if (!Array.isArray(timeline)) return ''
  return (timeline as TimelineEntry[]).map((e) => `${e.date} | ${e.label}`).join('\n')
}
