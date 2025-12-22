'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface User {
  id: string;
  username: string;
  walletAddress: string;
}

export default function ConnectWallet() {
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
      <div className="flex items-center space-x-2">
        <span className="text-xs text-neutral-400">
          Connected as <span className="text-white font-medium">{user.username}</span>
        </span>
        <button 
          onClick={disconnect}
          className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-900 text-neutral-500 border border-neutral-800 hover:border-red-900 hover:text-red-400 transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={connect}
      disabled={isConnecting}
      className="px-4 py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-white hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
