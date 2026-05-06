import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/db';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: NextRequest) {
  const { userId, title, body, url } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const subs = await prisma.pushSubscription.findMany({ where: { userId } });

  const results = await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title, body, url }),
      )
    )
  );

  // Clean up expired subscriptions
  const expired = results
    .map((r, i) => r.status === 'rejected' ? subs[i].endpoint : null)
    .filter(Boolean) as string[];
  if (expired.length) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: expired } } });
  }

  return NextResponse.json({ sent: subs.length - expired.length });
}
