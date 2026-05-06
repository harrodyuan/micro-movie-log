import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.midb.movieranking',
  appName: 'MIDB',
  // Points at your live Vercel site — no code duplication needed
  server: {
    url: 'https://micro-movie-log.vercel.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#000000',
  },
  android: {
    backgroundColor: '#000000',
  },
};

export default config;
