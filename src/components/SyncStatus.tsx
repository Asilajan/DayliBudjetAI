import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../services/api';

interface SyncStatusProps {
  onSync: () => void;
}

export function SyncStatus({ onSync }: SyncStatusProps) {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions'
        },
        (payload) => {
          console.log('Nouvelle transaction reçue:', payload);
          setNewCount(prev => prev + 1);
          setStatus('success');
          setLastSync(new Date());

          setTimeout(() => {
            setStatus('idle');
          }, 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (newCount > 0) {
      onSync();
      setNewCount(0);
    }
  }, [newCount, onSync]);

  const handleManualSync = () => {
    setStatus('syncing');
    onSync();
    setTimeout(() => {
      setStatus('success');
      setLastSync(new Date());
      setTimeout(() => setStatus('idle'), 2000);
    }, 1000);
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
        return 'Synchronisé';
      case 'error':
        return 'Erreur';
      default:
        return lastSync
          ? `Dernière sync: ${lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
          : 'Prêt';
    }
  };

  return (
    <div className="flex items-center gap-3">
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

      {newCount > 0 && (
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="text-xs font-medium text-green-400">
            {newCount} {newCount === 1 ? 'nouvelle transaction' : 'nouvelles transactions'}
          </span>
        </div>
      )}
    </div>
  );
}
