
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

type LoadableProps = {
  children: React.ReactNode;
};

export default function Loadable({ children }: LoadableProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-rpg-brown" />
            <p className="text-rpg-brown">Loading...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
