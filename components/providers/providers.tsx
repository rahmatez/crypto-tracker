"use client";

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SWRConfig } from 'swr';
import { PreferencesProvider } from './preferences-context';
import { fetcher } from '@/lib/fetcher';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 15000,
        onError: (error: unknown) => {
          console.error('SWR error', error);
        }
      }}
    >
      <PreferencesProvider>
        <AnimatePresence mode="wait">
          <motion.div
            key="app-shell"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </PreferencesProvider>
    </SWRConfig>
  );
}
