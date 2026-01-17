'use client';

import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useEffect } from 'react';

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const colors = {
  info: 'border-neon-blue bg-neon-blue/10',
  success: 'border-neon-green bg-neon-green/10',
  warning: 'border-neon-orange bg-neon-orange/10',
  error: 'border-neon-red bg-neon-red/10',
};

const iconColors = {
  info: 'text-neon-blue',
  success: 'text-neon-green',
  warning: 'text-neon-orange',
  error: 'text-neon-red',
};

export function NotificationToast() {
  const notifications = useStore((state) => state.notifications);
  const removeNotification = useStore((state) => state.removeNotification);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 5).map((notification) => {
          const Icon = icons[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`glass border-l-4 ${colors[notification.type]} rounded-lg p-4 flex items-start gap-3`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[notification.type]}`} />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
