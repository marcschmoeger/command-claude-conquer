'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Wifi,
  WifiOff,
  LogOut,
  User,
  Bell,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isConnected = useStore((state) => state.isConnected);
  const notifications = useStore((state) => state.notifications);
  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 glass z-30 flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pl-12">
          <Zap className="w-5 h-5 text-neon-blue" />
          <span className="font-bold">C3</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Command Claude and Conquer
          </span>
        </div>
      </div>

      {/* Center Section - Selection Info */}
      {selectedAgentIds.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-sm">
          {selectedAgentIds.length} agent{selectedAgentIds.length > 1 ? 's' : ''} selected
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Connection Status */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
            isConnected
              ? 'bg-neon-green/20 text-neon-green'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isConnected ? (
            <>
              <Wifi className="w-3 h-3" />
              <span className="hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {user?.displayName || 'Commander'}
              </div>
              <div className="text-xs text-muted-foreground">
                Level {user?.level || 1}
              </div>
            </div>
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg overflow-hidden z-50">
                <div className="p-3 border-b border-border">
                  <div className="font-medium">
                    {user?.displayName || user?.email}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user?.tier || 'Free'} Tier
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    // Navigate to settings
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted transition-colors text-sm text-neon-red"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
