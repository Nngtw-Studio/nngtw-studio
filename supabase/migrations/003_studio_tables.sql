-- =============================================================================
-- Migration 003: NNGTW Studio — studio_ prefixed tables
-- =============================================================================
-- These tables are dedicated to the NNGTW Studio public website.
-- They coexist safely with the portfolio tables (profiles, projects, skills, etc.)
-- in the same Supabase project by using the consistent "studio_" prefix.
--
-- Designed for future management from admin.nngtw.com.
-- DO NOT modify the existing portfolio tables.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- Games catalog (active titles + planned concepts)
CREATE TABLE IF NOT EXISTS studio_games (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT        UNIQUE NOT NULL,
  title             TEXT        NOT NULL,
  genre             TEXT        NOT NULL,
  platforms         TEXT[]      DEFAULT '{}',
  engine            TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'planned',
  -- status: 'in-development' | 'planned' | 'released' | 'concept'
  description       TEXT        NOT NULL,
  concept           TEXT,
  overview          TEXT,
  featured          BOOLEAN     DEFAULT FALSE,
  active_development BOOLEAN    DEFAULT FALSE,
  featured_order    INTEGER     DEFAULT 0,
  trailer_url       TEXT,
  banner_image_url  TEXT,
  project_link      TEXT,
  follow_link       TEXT,
  gallery           JSONB       DEFAULT '[]',
  -- gallery: string[] — image URLs
  roadmap           JSONB       DEFAULT '[]',
  -- roadmap: [{ phase: string, description: string }]
  published         BOOLEAN     DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- News articles, dev logs, announcements
CREATE TABLE IF NOT EXISTS studio_news_articles (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT        UNIQUE NOT NULL,
  title        TEXT        NOT NULL,
  excerpt      TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  category     TEXT        NOT NULL DEFAULT 'studio-news',
  -- category: 'development-log' | 'game-update' | 'studio-news' | 'technology' | 'announcement'
  published_at TIMESTAMPTZ DEFAULT NOW(),
  featured     BOOLEAN     DEFAULT FALSE,
  published    BOOLEAN     DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS studio_team_members (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL,
  role       TEXT        NOT NULL,
  bio        TEXT,
  avatar_url TEXT,
  "order"    INTEGER     DEFAULT 0,
  visible    BOOLEAN     DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job listings
CREATE TABLE IF NOT EXISTS studio_careers (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT        UNIQUE NOT NULL,
  title        TEXT        NOT NULL,
  department   TEXT        NOT NULL,
  location     TEXT        NOT NULL,
  type         TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'future',
  -- status: 'open' | 'internship' | 'future' | 'closed'
  description  TEXT        NOT NULL,
  requirements TEXT[]      DEFAULT '{}',
  published    BOOLEAN     DEFAULT TRUE,
  "order"      INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Career applications (write-only from public, read by admin)
CREATE TABLE IF NOT EXISTS studio_career_applications (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  career_id     UUID        REFERENCES studio_careers(id) ON DELETE SET NULL,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  portfolio_url TEXT,
  message       TEXT        NOT NULL,
  status        TEXT        DEFAULT 'pending',
  -- status: 'pending' | 'reviewing' | 'accepted' | 'rejected'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions (write-only from public, read by admin)
CREATE TABLE IF NOT EXISTS studio_contact_messages (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  type       TEXT        DEFAULT 'general',
  -- type: 'business' | 'general' | 'career' | 'press'
  read       BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technology / tools stack (displayed on homepage and tech page)
CREATE TABLE IF NOT EXISTS studio_technology_categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT        NOT NULL,
  description TEXT,
  items       TEXT[]      DEFAULT '{}',
  "order"     INTEGER     DEFAULT 0,
  visible     BOOLEAN     DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Studio philosophy / values
CREATE TABLE IF NOT EXISTS studio_philosophy_values (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  "order"     INTEGER     DEFAULT 0,
  visible     BOOLEAN     DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Key-value settings store (for admin-configurable content)
CREATE TABLE IF NOT EXISTS studio_settings (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT        UNIQUE NOT NULL,
  value      JSONB       NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studio media library (separate from portfolio media)
CREATE TABLE IF NOT EXISTS studio_media (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename   TEXT        NOT NULL,
  url        TEXT        NOT NULL,
  alt_text   TEXT,
  mime_type  TEXT,
  size_bytes INTEGER,
  context    TEXT,
  -- context: 'game' | 'news' | 'team' | 'general'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CMS pages (reserved for future admin.nngtw.com integration)
CREATE TABLE IF NOT EXISTS studio_pages (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT        UNIQUE NOT NULL,
  title           TEXT        NOT NULL,
  content         JSONB       DEFAULT '{}',
  published       BOOLEAN     DEFAULT FALSE,
  seo_title       TEXT,
  seo_description TEXT,
  og_image        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_studio_games_featured
  ON studio_games(featured, active_development);
CREATE INDEX IF NOT EXISTS idx_studio_games_slug
  ON studio_games(slug);
CREATE INDEX IF NOT EXISTS idx_studio_games_status
  ON studio_games(status);
CREATE INDEX IF NOT EXISTS idx_studio_games_published
  ON studio_games(published);

CREATE INDEX IF NOT EXISTS idx_studio_news_slug
  ON studio_news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_studio_news_published_at
  ON studio_news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_news_category
  ON studio_news_articles(category);
CREATE INDEX IF NOT EXISTS idx_studio_news_published
  ON studio_news_articles(published);

CREATE INDEX IF NOT EXISTS idx_studio_careers_slug
  ON studio_careers(slug);
CREATE INDEX IF NOT EXISTS idx_studio_careers_status
  ON studio_careers(status);

CREATE INDEX IF NOT EXISTS idx_studio_team_order
  ON studio_team_members("order");

CREATE INDEX IF NOT EXISTS idx_studio_tech_order
  ON studio_technology_categories("order");

CREATE INDEX IF NOT EXISTS idx_studio_philosophy_order
  ON studio_philosophy_values("order");

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

ALTER TABLE studio_games                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_news_articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_team_members          ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_careers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_career_applications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_contact_messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_technology_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_philosophy_values     ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_settings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_media                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_pages                 ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "studio: public read games"
  ON studio_games FOR SELECT USING (published = true);

CREATE POLICY "studio: public read news"
  ON studio_news_articles FOR SELECT USING (published = true);

CREATE POLICY "studio: public read team"
  ON studio_team_members FOR SELECT USING (visible = true);

CREATE POLICY "studio: public read careers"
  ON studio_careers FOR SELECT USING (published = true);

CREATE POLICY "studio: public read tech"
  ON studio_technology_categories FOR SELECT USING (visible = true);

CREATE POLICY "studio: public read philosophy"
  ON studio_philosophy_values FOR SELECT USING (visible = true);

CREATE POLICY "studio: public read settings"
  ON studio_settings FOR SELECT USING (true);

CREATE POLICY "studio: public read media"
  ON studio_media FOR SELECT USING (true);

CREATE POLICY "studio: public read published pages"
  ON studio_pages FOR SELECT USING (published = true);

-- Public write policies (form submissions — no auth required)
CREATE POLICY "studio: public insert contact"
  ON studio_contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "studio: public insert applications"
  ON studio_career_applications FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users — for admin.nngtw.com)
CREATE POLICY "studio: admin all games"
  ON studio_games FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all news"
  ON studio_news_articles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all team"
  ON studio_team_members FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all careers"
  ON studio_careers FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all applications"
  ON studio_career_applications FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all contact"
  ON studio_contact_messages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all tech"
  ON studio_technology_categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all philosophy"
  ON studio_philosophy_values FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all settings"
  ON studio_settings FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all media"
  ON studio_media FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "studio: admin all pages"
  ON studio_pages FOR ALL USING (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------------------------
-- Safe to re-run: uses ON CONFLICT DO NOTHING on UNIQUE columns,
-- or existence checks for tables without natural unique keys.
-- ---------------------------------------------------------------------------

-- Games
INSERT INTO studio_games
  (slug, title, genre, platforms, engine, status, description, overview,
   featured, active_development, featured_order,
   trailer_url, banner_image_url, project_link, follow_link, roadmap)
VALUES
  (
    'arithmetic-destination',
    'Arithmetic Destination',
    'Educational Adventure',
    ARRAY['PC', 'Mobile'],
    'Unity',
    'in-development',
    'An immersive educational journey where mathematics becomes exploration. Navigate abstract worlds built from numbers, patterns, and logic.',
    'Arithmetic Destination transforms mathematical concepts into explorable environments. Players journey through visually distinct realms — each representing fundamental mathematical principles — solving puzzles that feel like discovery rather than homework.',
    true, true, 1,
    '/videos/arithmetic-destination-trailer.mp4',
    '/banners/arithmetic-destination.svg',
    '/games/arithmetic-destination',
    'https://discord.gg/z3fpVJZkD',
    '[{"phase":"Core Mechanics","description":"Number-based puzzle systems and world traversal"},{"phase":"World Building","description":"First three mathematical realms with unique art direction"},{"phase":"Playtesting","description":"Community feedback sessions via Discord"},{"phase":"Platform Polish","description":"PC and Mobile optimization"}]'
  ),
  (
    'king-summon',
    'King Summon',
    'Strategy / Summoning',
    ARRAY['PC', 'Mobile'],
    'Unity',
    'in-development',
    'Command armies of summoned creatures in tactical battles. Build your kingdom, forge alliances, and master the art of summoning.',
    'King Summon blends strategic depth with accessible summoning mechanics. Players build and expand their kingdom while commanding diverse creature armies in tactical combat. Every summon matters — positioning, timing, and synergy define victory.',
    true, true, 2,
    '/videos/king-summon-trailer.mp4',
    '/banners/king-summon.svg',
    '/games/king-summon',
    'https://discord.gg/z3fpVJZkD',
    '[{"phase":"Combat Prototype","description":"Core summoning and battle loop"},{"phase":"Kingdom Systems","description":"Building, resources, and progression"},{"phase":"Creature Design","description":"Initial roster with unique abilities"},{"phase":"Multiplayer Foundation","description":"Async and real-time battle modes"}]'
  ),
  (
    'on-earth',
    'On Earth',
    'Narrative Exploration',
    ARRAY['PC', 'XR'],
    'Unreal Engine',
    'planned',
    'A contemplative journey across a transformed Earth. Explore remnants of civilization and nature reclaiming the world.',
    NULL,
    false, false, 0,
    NULL, NULL,
    '/games/on-earth',
    'https://discord.gg/z3fpVJZkD',
    '[]'
  ),
  (
    'bored-zombie',
    'Bored Zombie',
    'Casual / Comedy',
    ARRAY['Mobile', 'PC'],
    'Unity',
    'planned',
    'Life as an undead office worker. Navigate mundane daily routines with a darkly comedic twist.',
    NULL,
    false, false, 0,
    NULL, NULL,
    '/games/bored-zombie',
    'https://discord.gg/z3fpVJZkD',
    '[]'
  ),
  (
    'the-vastness',
    'The Vastness',
    'Space Exploration',
    ARRAY['PC', 'VR'],
    'Unreal Engine',
    'planned',
    'Drift through the infinite cosmos. A meditative space experience focused on scale, solitude, and wonder.',
    NULL,
    false, false, 0,
    NULL, NULL,
    '/games/the-vastness',
    'https://discord.gg/z3fpVJZkD',
    '[]'
  )
ON CONFLICT (slug) DO NOTHING;

-- Update concept for planned games (separate UPDATE so seed is idempotent)
UPDATE studio_games
SET concept = 'On Earth envisions a post-human landscape where nature has begun to heal. Players explore at their own pace, uncovering environmental storytelling and making choices that shape how the world remembers humanity.'
WHERE slug = 'on-earth' AND concept IS NULL;

UPDATE studio_games
SET concept = 'Bored Zombie reimagines the zombie genre through absurdist humor. Our undead protagonist shuffles through everyday tasks — commuting, meetings, lunch breaks — finding unexpected meaning in monotony.'
WHERE slug = 'bored-zombie' AND concept IS NULL;

UPDATE studio_games
SET concept = 'The Vastness is designed for VR-first exploration of procedurally generated star systems. Minimal UI, maximum immersion — players experience the awe of cosmic scale through sound design and visual spectacle.'
WHERE slug = 'the-vastness' AND concept IS NULL;

-- News articles
INSERT INTO studio_news_articles
  (slug, title, excerpt, content, category, published_at, featured)
VALUES
  (
    'king-summon-combat-prototype',
    'King Summon: Combat Prototype Milestone',
    'The core summoning and battle loop is now playable internally. Early feedback is shaping creature abilities and battle pacing.',
    E'We\'ve reached a significant milestone on King Summon — the combat prototype is now fully playable internally. The summoning system allows players to call creatures with distinct roles: tanks, damage dealers, and support units. Battle pacing emphasizes tactical positioning over reflexes.\n\nNext steps include expanding the creature roster and integrating kingdom-building mechanics that feed into combat strength.',
    'development-log',
    '2026-06-20',
    true
  ),
  (
    'arithmetic-destination-first-realm',
    'Arithmetic Destination: First Realm Complete',
    'The Number Forest realm is complete — our first fully explorable mathematical environment.',
    E'The Number Forest represents fundamental arithmetic through environmental design. Trees grow in Fibonacci spirals, rivers flow along number lines, and puzzles emerge naturally from the landscape.\n\nThis realm serves as our template for future mathematical worlds in Arithmetic Destination.',
    'game-update',
    '2026-06-10',
    true
  ),
  (
    'studio-discord-community-launch',
    'NNGTW Discord Community Now Open',
    'Join our Discord to follow development, share feedback, and participate in future playtests.',
    E'Our Discord community is now live. This is where development happens in the open — dev logs, behind-the-scenes content, and direct communication with the team.\n\nFuture playtest opportunities will be announced exclusively through Discord first.',
    'announcement',
    '2026-05-28',
    false
  ),
  (
    'openxr-research-update',
    'OpenXR Integration Research',
    'Exploring cross-platform XR development with OpenXR for future immersive projects.',
    E'As part of our long-term vision for XR and VR, we\'re researching OpenXR integration across Unity and Unreal Engine. This will enable our planned titles like The Vastness and On Earth to target multiple headset platforms from a single codebase.',
    'technology',
    '2026-05-15',
    false
  ),
  (
    'welcome-to-nngtw-studio',
    'Welcome to NNGTW Studio',
    'Introducing our studio — an independent team building original games with a vision for immersive futures.',
    E'NNGTW Studio is officially launching its public presence. We\'re a small, focused team creating original games for PC, mobile, and eventually XR platforms.\n\nOur first titles — Arithmetic Destination and King Summon — are actively in development. Follow along as we share our journey.',
    'studio-news',
    '2026-05-01',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- Team members (only seed if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM studio_team_members LIMIT 1) THEN
    INSERT INTO studio_team_members (name, role, bio, "order") VALUES
      ('Founder',            'Founder & Creative Director', 'Vision, creative direction, and studio leadership.',                       1),
      ('Community Lead',     'Marketing & Community',       'Player engagement, social presence, and community growth.',               2),
      ('XR Developer',       'XR Developer',                'Immersive technology research and XR prototyping.',                       3),
      ('Frontend Developer', 'Frontend Developer',          'Web applications, studio tools, and interactive experiences.',            4);
  END IF;
END $$;

-- Technology categories (only seed if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM studio_technology_categories LIMIT 1) THEN
    INSERT INTO studio_technology_categories (title, description, items, "order") VALUES
      (
        'Game Development',
        'Industry-standard engines and languages powering our game projects.',
        ARRAY['Unity', 'Unreal Engine', 'Unreal Blueprints', 'C#', 'C++', 'OpenXR'],
        1
      ),
      (
        'Web & Applications',
        'Modern web stack for applications, tools, and studio infrastructure.',
        ARRAY['React', 'Next.js', 'React Native', 'JavaScript', 'TypeScript', 'Firebase', 'Supabase', 'SQL'],
        2
      ),
      (
        'Art & Concept',
        'Creative tools for concept art, 3D modeling, and visual production.',
        ARRAY['Blender', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketchbook Pro', 'Adobe Premiere Pro', 'Adobe After Effects'],
        3
      ),
      (
        'Future Technologies',
        'Emerging technologies shaping our long-term vision.',
        ARRAY['XR', 'VR', 'Mixed Reality', 'AI Assisted Workflows', 'Interactive Computing'],
        4
      );
  END IF;
END $$;

-- Philosophy values (only seed if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM studio_philosophy_values LIMIT 1) THEN
    INSERT INTO studio_philosophy_values (title, description, "order") VALUES
      ('Player First',                 'Every decision starts with the player experience. We build games people genuinely want to play.',                                  1),
      ('Original Worlds',              'We create unique universes with distinct identity — never derivative, always authentic.',                                            2),
      ('Free-to-Play Philosophy',      'Accessibility matters. Our free-to-play titles remove barriers to entry without compromising quality.',                             3),
      ('Fair Monetization',            'Players should never feel exploited. Cosmetic and convenience options — never pay-to-win.',                                         4),
      ('Long-term Communities',        'We invest in communities that grow with our games over years, not months.',                                                         5),
      ('Innovation through Technology','We embrace new tools and platforms to push what independent studios can achieve.',                                                  6),
      ('Cross-platform Thinking',      'Games should reach players wherever they are — PC, mobile, console, and beyond.',                                                   7),
      ('Immersive Experiences',        'From screen to headset, we design experiences that pull players into our worlds.',                                                  8);
  END IF;
END $$;

-- Careers (only seed if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM studio_careers LIMIT 1) THEN
    INSERT INTO studio_careers (slug, title, department, location, type, status, description, requirements, "order") VALUES
      (
        'game-programmer', 'Game Programmer', 'Engineering', 'Remote', 'Full-time', 'future',
        'Join our engineering team to build gameplay systems, tools, and infrastructure for our active projects.',
        ARRAY['Strong C# or C++ experience', 'Unity or Unreal Engine proficiency', 'Passion for game development', 'Self-directed and collaborative'],
        1
      ),
      (
        'game-designer', 'Game Designer', 'Design', 'Remote', 'Full-time', 'future',
        'Shape game mechanics, systems design, and player experience across our portfolio.',
        ARRAY['Portfolio demonstrating systems thinking', 'Understanding of player psychology', 'Experience with prototyping', 'Strong communication skills'],
        2
      ),
      (
        '3d-artist', '3D Artist', 'Art', 'Remote', 'Full-time', 'future',
        'Create environments, props, and characters that bring our game worlds to life.',
        ARRAY['Proficiency in Blender or similar', 'Strong understanding of game art pipelines', 'Portfolio of 3D work', 'Ability to match art direction'],
        3
      ),
      (
        'technical-artist', 'Technical Artist', 'Art', 'Remote', 'Full-time', 'future',
        'Bridge art and engineering — shaders, VFX, optimization, and pipeline tools.',
        ARRAY['Shader programming experience', 'Engine tool development', 'Strong artistic and technical skills', 'Performance optimization knowledge'],
        4
      ),
      (
        'animator', 'Animator', 'Art', 'Remote', 'Full-time', 'future',
        'Bring characters and creatures to life with compelling animation.',
        ARRAY['Character animation portfolio', 'Experience with game animation pipelines', 'Understanding of locomotion and combat animation'],
        5
      ),
      (
        'xr-developer', 'XR Developer', 'Engineering', 'Remote', 'Full-time', 'future',
        'Research and develop immersive experiences for our XR and VR roadmap.',
        ARRAY['OpenXR or platform-specific XR experience', 'Unity or Unreal VR development', 'Comfort with emerging technology', 'Spatial design awareness'],
        6
      ),
      (
        'frontend-developer', 'Frontend Developer', 'Engineering', 'Remote', 'Full-time', 'future',
        'Build web applications, studio tools, and interactive experiences.',
        ARRAY['React / Next.js proficiency', 'TypeScript experience', 'UI/UX sensibility', 'Experience with real-time data'],
        7
      ),
      (
        'ui-ux-designer', 'UI/UX Designer', 'Design', 'Remote', 'Full-time', 'future',
        'Design intuitive interfaces for games and studio applications.',
        ARRAY['Game UI portfolio', 'User research experience', 'Figma or similar proficiency', 'Understanding of accessibility'],
        8
      ),
      (
        'qa-tester', 'QA Tester', 'Quality', 'Remote', 'Full-time', 'future',
        'Ensure quality across all platforms through systematic testing.',
        ARRAY['Detail-oriented mindset', 'Experience writing bug reports', 'Multi-platform gaming experience', 'Patience and persistence'],
        9
      ),
      (
        'marketing-intern', 'Marketing Intern', 'Marketing', 'Remote', 'Internship', 'internship',
        'Learn game marketing while supporting our community and social presence.',
        ARRAY['Passion for games and game culture', 'Social media familiarity', 'Creative writing ability', 'Currently enrolled in relevant program'],
        10
      ),
      (
        'community-manager', 'Community Manager', 'Community', 'Remote', 'Full-time', 'future',
        'Grow and nurture our player community across Discord and social platforms.',
        ARRAY['Community management experience', 'Excellent communication', 'Conflict resolution skills', 'Genuine love for games'],
        11
      );
  END IF;
END $$;

-- Settings
INSERT INTO studio_settings (key, value) VALUES
  ('discord_url',    '"https://discord.gg/z3fpVJZkD"'),
  ('studio_name',    '"NNGTW Studio"'),
  ('contact_email',  '"nngtwstudio@gmail.com"'),
  ('social_links',   '{"discord":"https://discord.gg/z3fpVJZkD","twitter":"","youtube":"","instagram":""}')
ON CONFLICT (key) DO NOTHING;
