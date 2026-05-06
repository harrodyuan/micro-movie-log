import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "follows" (
        "id"           TEXT NOT NULL PRIMARY KEY,
        "follower_id"  TEXT NOT NULL,
        "following_id" TEXT NOT NULL,
        "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "follows_follower_id_following_id_key" UNIQUE ("follower_id", "following_id")
      )
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "push_subscriptions" (
        "id"         TEXT NOT NULL PRIMARY KEY,
        "user_id"    TEXT NOT NULL,
        "endpoint"   TEXT NOT NULL UNIQUE,
        "p256dh"     TEXT NOT NULL,
        "auth"       TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    // Verify
    const followCount = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM follows`;
    const pushCount   = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM push_subscriptions`;

    return NextResponse.json({
      ok: true,
      follows_rows: Number(followCount[0].count),
      push_rows: Number(pushCount[0].count),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
