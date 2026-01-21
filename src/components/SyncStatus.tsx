import { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { syncFromN8N } from '../services/api';

interface SyncStatusProps {
  onSync: () => void;
}

export function SyncStatus({ onSync }: SyncStatusProps) {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleAutoSync();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleAutoSync = async () => {
    try {
      setStatus('syncing');
      await onSync();
      setStatus('success');
      setLastSync(new Date());
      setIsConnected(true);
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setIsConnected(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleManualSync = async () => {
    setStatus('syncing');
    try {
      await syncFromN8N();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onSync();
      setStatus('success');
      setLastSync(new Date());
      setIsConnected(true);
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setIsConnected(false);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'syncing':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-[#6b6b6b]';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <RefreshCw className={`w-4 h-4 ${status === 'syncing' ? 'animate-spin' : ''}`} />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'syncing':
        return 'Synchronisation...';
      case 'success':
        return 'Synchronise';
      case 'error':
        return 'Erreur';
      default:
        return lastSync
          ? `Sync: ${lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
          : 'Pret';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
        {isConnected ? (
          <Wifi className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-red-400" />
        )}
        <span className="text-xs text-[#8b8b8b]">Supabase</span>
      </div>

      <button
        onClick={handleManualSync}
        disabled={status === 'syncing'}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:bg-[#242424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={getStatusColor()}>
          {getStatusIcon()}
        </span>
        <span className="text-sm text-[#e5e5e5]">{getStatusText()}</span>
      </button>
    </div>
  );
}
