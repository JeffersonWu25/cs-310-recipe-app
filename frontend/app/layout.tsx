import type { Metadata } from 'next';
import './globals.css';
import { PantryProvider } from './context/PantryContext';

export const metadata: Metadata = {
  title: 'Smart Pantry Chef',
  description: 'Get recipe suggestions based on what\'s in your pantry',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PantryProvider>
          {children}
        </PantryProvider>
      </body>
    </html>
  );
}
