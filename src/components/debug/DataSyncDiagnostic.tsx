import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useGameData } from "@/contexts/DataContext";

interface DiagnosticInfo {
  sessionStatus: 'valid' | 'expired' | 'missing' | 'checking';
  networkStatus: 'online' | 'offline';
  supabaseStatus: 'connected' | 'disconnected' | 'checking';
  pendingSyncCount: number;
  lastError: string | null;
  syncErrors: string[];
}

export const DataSyncDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticInfo>({
    sessionStatus: 'checking',
    networkStatus: navigator.onLine ? 'online' : 'offline',
    supabaseStatus: 'checking',
    pendingSyncCount: 0,
    lastError: null,
    syncErrors: []
  });
  
  const { session, isAuthenticated } = useAuth();
  const gameData = useGameData();

  useEffect(() => {
    runDiagnostics();
    
    // Listen for network changes
    const handleOnline = () => setDiagnostics(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setDiagnostics(prev => ({ ...prev, networkStatus: 'offline' }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const runDiagnostics = async () => {
    // Check session status
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!currentSession) {
        setDiagnostics(prev => ({ ...prev, sessionStatus: 'missing' }));
      } else {
        const expiresAt = new Date(currentSession.expires_at! * 1000);
        const isExpired = expiresAt <= new Date();
        setDiagnostics(prev => ({ 
          ...prev, 
          sessionStatus: isExpired ? 'expired' : 'valid' 
        }));
      }
    } catch (error) {
      setDiagnostics(prev => ({ 
        ...prev, 
        sessionStatus: 'missing',
        lastError: error.message 
      }));
    }

    // Check Supabase connectivity
    try {
      const { data, error } = await supabase.from('characters').select('id').limit(1);
      setDiagnostics(prev => ({ 
        ...prev, 
        supabaseStatus: error ? 'disconnected' : 'connected' 
      }));
    } catch (error) {
      setDiagnostics(prev => ({ 
        ...prev, 
        supabaseStatus: 'disconnected',
        lastError: error.message 
      }));
    }

    // Check for pending syncs
    try {
      const pendingSync = localStorage.getItem('pendingSync');
      const syncErrors = [];
      
      if (pendingSync) {
        const pending = JSON.parse(pendingSync);
        setDiagnostics(prev => ({ ...prev, pendingSyncCount: 1 }));
        syncErrors.push(`Pending sync from ${new Date(pending.timestamp).toLocaleString()}`);
      }
      
      // Check for recent error patterns in console
      // Note: This is a placeholder - in production, you'd implement proper error tracking
      const recentErrors: string[] = [];
      
      setDiagnostics(prev => ({ ...prev, syncErrors }));
    } catch (error) {
      console.error('Error checking pending syncs:', error);
    }
  };

  const clearPendingSync = () => {
    localStorage.removeItem('pendingSync');
    setDiagnostics(prev => ({ ...prev, pendingSyncCount: 0 }));
    toast.success('Cleared pending sync operations');
  };

  const forceResync = async () => {
    try {
      toast.info('Forcing data resync...');
      // Trigger a manual sync
      window.dispatchEvent(new CustomEvent('force-data-reload'));
      setTimeout(() => {
        runDiagnostics();
      }, 2000);
    } catch (error) {
      toast.error('Failed to trigger resync');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
      case 'online':
      case 'connected':
        return 'bg-green-500';
      case 'expired':
      case 'offline':
      case 'disconnected':
        return 'bg-red-500';
      case 'missing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Data Sync Diagnostics</CardTitle>
        <CardDescription>
          Debug information for data saving issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Badge className={getStatusColor(diagnostics.sessionStatus)}>
              Session: {diagnostics.sessionStatus}
            </Badge>
          </div>
          <div className="text-center">
            <Badge className={getStatusColor(diagnostics.networkStatus)}>
              Network: {diagnostics.networkStatus}
            </Badge>
          </div>
          <div className="text-center">
            <Badge className={getStatusColor(diagnostics.supabaseStatus)}>
              Database: {diagnostics.supabaseStatus}
            </Badge>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="space-y-2 text-sm">
          <div>
            <strong>User ID:</strong> {session?.user?.id || 'Not logged in'}
          </div>
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Pending Syncs:</strong> {diagnostics.pendingSyncCount}
          </div>
          {diagnostics.lastError && (
            <div>
              <strong>Last Error:</strong> 
              <span className="text-red-600 ml-2">{diagnostics.lastError}</span>
            </div>
          )}
        </div>

        {/* Sync Errors */}
        {diagnostics.syncErrors.length > 0 && (
          <div>
            <strong>Recent Sync Issues:</strong>
            <ul className="list-disc list-inside text-sm text-red-600 mt-2">
              {diagnostics.syncErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runDiagnostics} variant="outline" size="sm">
            Refresh Diagnostics
          </Button>
          {diagnostics.pendingSyncCount > 0 && (
            <Button onClick={clearPendingSync} variant="outline" size="sm">
              Clear Pending Syncs
            </Button>
          )}
          <Button onClick={forceResync} variant="outline" size="sm">
            Force Resync
          </Button>
        </div>

        {/* Recommendations */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <strong>Common Solutions:</strong>
          <ul className="list-disc list-inside text-sm mt-2">
            {diagnostics.sessionStatus === 'expired' && (
              <li>Session expired - try logging out and back in</li>
            )}
            {diagnostics.networkStatus === 'offline' && (
              <li>Network offline - check your internet connection</li>
            )}
            {diagnostics.supabaseStatus === 'disconnected' && (
              <li>Database connection failed - try refreshing the page</li>
            )}
            {diagnostics.pendingSyncCount > 0 && (
              <li>Clear pending syncs and try saving again</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSyncDiagnostic;
