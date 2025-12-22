import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, movieAId, movieBId, winnerId } = await request.json();

    if (!userId || !movieAId || !movieBId || !winnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get today's date string
    const today = new Date();
    const battleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Check if user already voted today
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_battleDate: {
          userId,
          battleDate
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted today', vote: existingVote },
        { status: 409 }
      );
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        battleDate,
        movieAId,
        movieBId,
        winnerId,
        userId
      }
    });

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error saving vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's vote for today
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const today = new Date();
    const battleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const vote = await prisma.vote.findUnique({
      where: {
        userId_battleDate: {
          userId,
          battleDate
        }
      }
    });

    return NextResponse.json({ vote });
  } catch (error) {
    console.error('Error getting vote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
