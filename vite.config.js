import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access (like from ngrok)
    allowedHosts: ['2e1efee0c0b1.ngrok-free.app'], // Replace with your actual ngrok subdomain
  },
});
