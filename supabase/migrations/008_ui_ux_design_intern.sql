-- =============================================================================
-- Migration 008: UI/UX Design Intern — first live opening
-- =============================================================================
-- Adds the active internship posting that mirrors the LinkedIn listing
-- (Nngtw Studio · India · Remote · Internship) as a real row in
-- studio_careers, so /careers and the homepage Careers section surface it
-- instead of only the code fallback in src/lib/data/content.ts.
--
-- "order" = 0 puts it above the future-opportunity roles seeded in 003
-- (which start at 1), on both the listing page and the homepage (which
-- takes the first 6 non-closed roles ordered by "order").
--
-- Idempotent: keyed on the unique slug, so rerunning refreshes the copy.
-- =============================================================================

INSERT INTO studio_careers (
  slug, title, department, location, type, status, description, requirements, published, "order"
) VALUES (
  'ui-ux-design-intern',
  'UI/UX Design Intern',
  'Design',
  'India (Remote)',
  'Internship',
  'internship',
  'Help design engaging, user-friendly experiences for our web, mobile, and gamified applications. You''ll create wireframes, mockups, and interactive prototypes, run basic user research, iterate on designs with feedback throughout development, and keep visual consistency across products — with room to explore new UI trends, creative solutions, and AI tools that speed up design workflows. Expect hands-on work on real products, regular design feedback and mentorship, credits for your contributions where applicable, and a certificate on successful completion.',
  ARRAY[
    'Basic understanding of UI/UX design principles',
    'Basic knowledge of Figma',
    'Willingness to learn, explore new tools, and improve continuously',
    'Passion for UI/UX design with attention to detail',
    'Comfortable receiving feedback and iterating on designs',
    'Nice to have: portfolio, resume, or personal projects',
    'Nice to have: understanding of color theory, typography, or visual hierarchy',
    'Nice to have: basic knowledge of responsive design',
    'Nice to have: familiarity with AI tools for design and creative workflows',
    'Nice to have: serious about learning, self-improvement, and investing time in developing UI/UX skills'
  ],
  TRUE,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  department   = EXCLUDED.department,
  location     = EXCLUDED.location,
  type         = EXCLUDED.type,
  status       = EXCLUDED.status,
  description  = EXCLUDED.description,
  requirements = EXCLUDED.requirements,
  published    = EXCLUDED.published,
  "order"      = EXCLUDED."order",
  updated_at   = NOW();
