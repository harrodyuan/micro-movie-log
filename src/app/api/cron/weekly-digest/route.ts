import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Called by Vercel Cron every Monday at 9am UTC
export async function GET(req: NextRequest) {
  // Protect with cron secret
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: 'No RESEND_API_KEY configured' });
  }

  // Get all users with email + at least 5 ranked movies
  const users = await prisma.user.findMany({
    where: { email: { not: null } },
    include: {
      movies: { orderBy: { elo: 'desc' }, take: 10 },
    },
  });

  let sent = 0;
  for (const user of users) {
    if (!user.email || user.movies.length < 3) continue;

    const top3 = user.movies.slice(0, 3);
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#000;color:#fff;font-family:sans-serif;padding:32px;max-width:500px;margin:0 auto;">
  <div style="border-bottom:3px solid #EAB308;margin-bottom:24px;padding-bottom:16px;">
    <span style="font-size:24px;font-weight:900;color:#EAB308;">MIDB</span>
    <span style="color:#71717a;font-size:12px;margin-left:8px;">Weekly Rankings Digest</span>
  </div>

  <p style="color:#a1a1aa;font-size:14px;">Hey @${user.username} 👋 — here's where your movies stand this week:</p>

  <div style="margin:24px 0;">
    ${top3.map((m, i) => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:12px;background:#18181b;border-radius:8px;">
      <span style="font-size:20px;width:28px;text-align:center;">${['🥇','🥈','🥉'][i]}</span>
      ${m.posterUrl ? `<img src="${m.posterUrl}" width="32" height="48" style="border-radius:4px;object-fit:cover;" />` : ''}
      <div>
        <div style="font-weight:600;color:#fff;">${m.title}</div>
        <div style="font-size:12px;color:#71717a;">${m.elo} elo · ${m.matches} battles</div>
      </div>
    </div>`).join('')}
  </div>

  <p style="color:#71717a;font-size:13px;">You have <strong style="color:#fff;">${user.movies.length} movies</strong> ranked total. Keep battling to sharpen your list.</p>

  <a href="https://micro-movie-log.vercel.app/users/${user.username}"
    style="display:inline-block;margin-top:16px;padding:12px 24px;background:#EAB308;color:#000;font-weight:700;border-radius:8px;text-decoration:none;">
    View my rankings →
  </a>

  <p style="margin-top:32px;color:#3f3f46;font-size:11px;">
    Unsubscribe: reply with "unsubscribe" · micro-movie-log.vercel.app
  </p>
</body>
</html>`;

    try {
      await resend.emails.send({
        from: 'MIDB <digest@midb.app>',
        to: user.email,
        subject: `Your #1 this week: ${top3[0]?.title || 'your movies'}`,
        html,
      });
      sent++;
    } catch {}
  }

  return NextResponse.json({ sent, total: users.length });
}
