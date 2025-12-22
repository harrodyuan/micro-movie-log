'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  walletAddress: string;
}

export function ConnectWallet() {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('movie_log_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    setIsConnecting(true);

    try {
      // 1. Request Wallet Access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        const address = accounts[0];

        // 2. Login/Register via API
        const response = await fetch('/api/auth/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address })
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          localStorage.setItem('movie_log_user', JSON.stringify(data.user));
        } else {
          console.error('Login failed:', data.error);
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    localStorage.removeItem('movie_log_user');
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link 
          href={`/${user.username}/log`}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-neutral-800 transition-all"
        >
          {user.username}
        </Link>
        <button 
          onClick={disconnect}
          className="px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white transition-all"
          title="Log out"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={connect}
        disabled={isConnecting}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-neutral-800 transition-all disabled:opacity-50"
      >
        Log In
      </button>
      <button 
        onClick={connect}
        disabled={isConnecting}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Sign Up'}
      </button>
    </div>
  );
}
