import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Check if user exists with this wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress: address }
    });

    // If not, create a new user
    if (!user) {
      // Generate a simplified username from the address
      const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      // Check if username collision (unlikely but possible with shortened logic, so we append timestamp or something if needed, but for now kept simple)
      // Actually, let's just use the address as the initial username or "User [Address]"
      
      try {
        user = await prisma.user.create({
          data: {
            username: shortAddress,
            walletAddress: address,
            bio: 'Just joined the Micro Movie Log!',
          }
        });
      } catch (e) {
        // Fallback if username taken (unlikely with address)
        user = await prisma.user.create({
          data: {
            username: `User_${Date.now()}`,
            walletAddress: address,
          }
        });
      }
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error processing wallet login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
