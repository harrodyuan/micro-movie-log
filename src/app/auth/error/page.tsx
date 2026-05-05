'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  Configuration: 'Google sign-in is not configured yet.',
  AccessDenied: 'Access was denied.',
  Verification: 'The sign-in link expired. Please try again.',
  OAuthCallback: 'Google sign-in failed. The app may not be configured yet.',
  Default: 'Something went wrong with sign-in.',
};

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get('error') || 'Default';
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Sign-in Error</h1>
          <p className="text-zinc-400 text-sm mb-6">{message}</p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
        <p className="mt-4 text-zinc-600 text-xs">
          <Link href="/" className="hover:text-zinc-400">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
