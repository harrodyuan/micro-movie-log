import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const movies = await prisma.movie.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        date: true,
        rating: true,
        posterUrl: true,
      },
    });

    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { title, date, rating, posterUrl, review } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        date: date || new Date().toISOString().split('T')[0],
        rating: rating || 5,
        posterUrl,
        review,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ movie });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}
