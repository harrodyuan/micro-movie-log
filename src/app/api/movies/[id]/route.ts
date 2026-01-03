import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Verify the movie belongs to the user
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    if (movie.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
