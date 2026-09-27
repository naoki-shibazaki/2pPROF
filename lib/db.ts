import { neon } from '@neondatabase/serverless'
import { Pool } from 'pg'

export const sql = neon(process.env.DATABASE_URL!)

// pg.Pool for @auth/pg-adapter (session-based auth)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1, // serverless-friendly
})

export async function initSchema() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        phone TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        hashed_password TEXT,
        UNIQUE(provider, "providerAccountId")
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY(identifier, token)
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS phone_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone TEXT NOT NULL,
        phone_token TEXT UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    // Profile columns (added after initial schema)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS handle TEXT UNIQUE`)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT FALSE`)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS hp INTEGER DEFAULT 100`)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS proximity_count INTEGER DEFAULT 0`)
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS proximity_mode TEXT DEFAULT 'on'`)

    // App tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_locations (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS proximity_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_a_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        user_b_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        distance_m NUMERIC(10,1) DEFAULT 0,
        occurred_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(follower_id, following_id)
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS invite_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT NOT NULL UNIQUE,
        creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS friend_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT,
        answered_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS self_qa (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        items JSONB NOT NULL DEFAULT '[]',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, read)`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS introductions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(target_id, author_id)
      )
    `)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_intro_target ON introductions(target_id)`)
    await client.query(`ALTER TABLE introductions ADD COLUMN IF NOT EXISTS met_year SMALLINT`)
    await client.query(`ALTER TABLE introductions ADD COLUMN IF NOT EXISTS met_month SMALLINT`)
    await client.query(`
      CREATE TABLE IF NOT EXISTS qa_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        question_hash TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        moderation_flagged BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_qa_comments_target ON qa_comments(target_user_id, question_hash)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_qa_comments_status ON qa_comments(target_user_id, status)`)
    // Indices for frequently queried columns
    await client.query(`CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_proximity_pair ON proximity_events(user_a_id, user_b_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_friend_q_receiver ON friend_questions(receiver_id)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_handle ON users(handle)`)
  } finally {
    client.release()
  }
}
