import { AddMoviesClient } from '@/components/AddMoviesClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AddMoviesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/signin');

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Add Movies</h1>
          <p className="text-zinc-500 text-sm">Search the catalog and add movies to your personal ranking</p>
        </header>
        <AddMoviesClient />
      </div>
    </main>
  );
}
