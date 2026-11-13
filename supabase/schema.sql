-- ====================================================================
-- Hambalyo 💍 — Digital Wedding Message Wall
-- Database Schema for Supabase (PostgreSQL + Realtime + RLS)
-- ====================================================================

-- 1. Create Relationship Enum Type
DO $$ BEGIN
    CREATE TYPE relationship_type AS ENUM (
        'Waalid', 
        'Walal', 
        'Saaxib', 
        'Xiriir', 
        'Macallin', 
        'Jaar'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    couple_names VARCHAR(150) NOT NULL,
    wedding_date DATE,
    welcome_note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_name VARCHAR(60) NOT NULL,
    relationship relationship_type NOT NULL,
    content TEXT NOT NULL CHECK (char_length(content) >= 5 AND char_length(content) <= 600),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    client_fingerprint VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_messages_event_created 
    ON messages (event_id, is_pinned DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_slug 
    ON events (slug);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 6. Events Policies
DROP POLICY IF EXISTS "Public read events" ON events;
CREATE POLICY "Public read events" 
    ON events FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Curator update events" ON events;
CREATE POLICY "Curator update events" 
    ON events FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- 7. Messages Policies
DROP POLICY IF EXISTS "Public read approved messages" ON messages;
CREATE POLICY "Public read approved messages" 
    ON messages FOR SELECT 
    USING (is_approved = true);

DROP POLICY IF EXISTS "Public insert messages" ON messages;
CREATE POLICY "Public insert messages" 
    ON messages FOR INSERT 
    WITH CHECK (
        char_length(content) >= 5 AND char_length(content) <= 600 AND
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = messages.event_id 
              AND events.is_active = true
        )
    );

DROP POLICY IF EXISTS "Curator manage messages" ON messages;
CREATE POLICY "Curator manage messages" 
    ON messages FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- 8. Enable Supabase Realtime for Messages
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 9. Seed Default Wedding Event (Amina & Warsame)
INSERT INTO events (slug, couple_names, wedding_date, welcome_note, is_active)
VALUES (
    'amina-warsame',
    'Amina & Warsame',
    '2025-10-24',
    'Soomaali & English blessings welcome. Leave your warm wishes, cherished memories, and du’aas for the happy couple.',
    true
)
ON CONFLICT (slug) DO UPDATE SET
    couple_names = EXCLUDED.couple_names,
    welcome_note = EXCLUDED.welcome_note,
    is_active = EXCLUDED.is_active;

-- 10. Seed Initial Heirloom Blessings
INSERT INTO messages (event_id, guest_name, relationship, content, is_pinned, is_approved, created_at)
SELECT 
    e.id,
    m.guest_name,
    m.relationship::relationship_type,
    m.content,
    m.is_pinned,
    m.is_approved,
    m.created_at
FROM events e
CROSS JOIN (
    VALUES 
    (
        'Ayeeyo Maryan & Oday Guuleed',
        'Waalid',
        'Guurkiina ha noqdo mid barakeysan oo lagu nasto. Waxaan idiin rajeyneynaa nolol buuxda oo naxariis, jacayl iyo ubad khayr qaba leh. Hambalyo boqorka iyo boqoradda!',
        false,
        true,
        NOW() - INTERVAL '3 minutes'
    ),
    (
        'Dr. Khadar & Samira Al-Mansoor',
        'Saaxib',
        'Wishing you both a lifetime of unyielding love, immense barakah, and joyous laughter. Warsame, you found a true gem in Amina, and Amina, a gentleman who cherishes you beyond words. What an unforgettable night!',
        false,
        true,
        NOW() - INTERVAL '14 minutes'
    ),
    (
        'Farxiyo Warsame',
        'Walal',
        'To my dearest brother Warsame and my gorgeous new sister Amina! From our childhood games in Borama to watching you stand hand-in-hand today, my heart is overflowing with pure happiness. Ducada walal mar walba waa idin la jirtaa.',
        false,
        true,
        NOW() - INTERVAL '28 minutes'
    ),
    (
        'Prof. Hassan Nur',
        'Macallin',
        'Barakallahu laka wa baraka alayka wa jama’a baynakuma fee khayr. May Allah bless your union with eternal peace, intellectual companionship, and mutual understanding. Deeply honored to witness this sacred milestone.',
        false,
        true,
        NOW() - INTERVAL '60 minutes'
    ),
    (
        'The Osman Family',
        'Xiriir',
        'Hambalyo arooskiina wacan! So deeply delighted to celebrate this sacred union together. May every chapter ahead be sweeter than the last, filled with hospitality, travels, and warmth.',
        false,
        true,
        NOW() - INTERVAL '120 minutes'
    ),
    (
        'Safia & Jamal (Seattle)',
        'Jaar',
        'Sending our warmest blessings across the miles! You two look breathtaking. May your home be forever anchored in tranquility, affection, and endless hospitality.',
        false,
        true,
        NOW() - INTERVAL '180 minutes'
    )
) AS m(guest_name, relationship, content, is_pinned, is_approved, created_at)
WHERE e.slug = 'amina-warsame'
  AND NOT EXISTS (
      SELECT 1 FROM messages existing 
      WHERE existing.event_id = e.id AND existing.guest_name = m.guest_name
  );
