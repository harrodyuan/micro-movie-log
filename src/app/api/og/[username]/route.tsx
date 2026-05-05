import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      movies: {
        orderBy: { elo: 'desc' },
        take: 10,
        select: { title: true, date: true, posterUrl: true, elo: true },
      },
    },
  });

  if (!user) {
    return new Response('Not found', { status: 404 });
  }

  const top10 = user.movies;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Yellow top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: '#EAB308' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '14px', color: '#71717a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              MIDB · Personal Rankings
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff' }}>
              @{username}
            </div>
            <div style={{ fontSize: '14px', color: '#71717a', marginTop: '6px' }}>
              Top {top10.length} movies · ranked by battle results
            </div>
          </div>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#EAB308' }}>MIDB</div>
        </div>

        {/* Movie list — two columns */}
        <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
          {/* Left column: 1-5 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {top10.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: i === 0 ? '#EAB308' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#27272a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 900,
                  color: i < 3 ? '#000' : '#fff', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                {m.posterUrl && (
                  <img src={m.posterUrl} width={30} height={44}
                    style={{ borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#71717a' }}>
                    {m.date?.split('-')[0]} · {m.elo} elo
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column: 6-10 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {top10.slice(5, 10).map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#27272a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 900, color: '#71717a', flexShrink: 0,
                }}>
                  {i + 6}
                </div>
                {m.posterUrl && (
                  <img src={m.posterUrl} width={30} height={44}
                    style={{ borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#52525b' }}>
                    {m.date?.split('-')[0]} · {m.elo} elo
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', fontSize: '12px', color: '#3f3f46', borderTop: '1px solid #27272a', paddingTop: '16px' }}>
          micro-movie-log.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
