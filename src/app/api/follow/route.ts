import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/follow?username=X — check if I follow X, get counts
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const target = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { followers: true, following: true } },
    },
  });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const session = await getServerSession(authOptions);
  let isFollowing = false;
  if (session?.user?.id) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: session.user.id, followingId: target.id } },
    });
    isFollowing = !!follow;
  }

  return NextResponse.json({
    followers: target._count.followers,
    following: target._count.following,
    isFollowing,
  });
}

// POST /api/follow — follow a user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { username } = await req.json();
  const target = await prisma.user.findUnique({ where: { username } });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (target.id === session.user.id) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: session.user.id, followingId: target.id } },
    create: { followerId: session.user.id, followingId: target.id },
    update: {},
  });

  // Send push notification to the followed user
  try {
    await fetch(`${process.env.NEXTAUTH_URL || ''}/api/push/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: target.id,
        title: 'New Follower',
        body: `@${session.user.username || session.user.name} started following you`,
        url: `/users/${session.user.username || session.user.name}`,
      }),
    });
  } catch {}

  return NextResponse.json({ ok: true });
}

// DELETE /api/follow — unfollow
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { username } = await req.json();
  const target = await prisma.user.findUnique({ where: { username } });
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await prisma.follow.deleteMany({
    where: { followerId: session.user.id, followingId: target.id },
  });

  return NextResponse.json({ ok: true });
}
