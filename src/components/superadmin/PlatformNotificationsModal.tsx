import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Clock,
  Check
} from 'lucide-react';

export const PlatformNotificationsView: React.FC = () => {
  const { platformNotifications, markNotificationRead, t } = usePMS();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              REAL-TIME PLATFORM SIGNALS
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('notif_title', 'Platform Notifications & Alerts')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('notif_subtitle', 'System alerts, upcoming subscription expirations, client limit breaches, and security notices.')}
          </p>
        </div>

        <div className="text-right">
          <span className="px-3 py-1.5 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-xs font-bold">
            {platformNotifications.filter((n) => !n.isRead).length} Unread Alerts
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] divide-y divide-black/[0.04] dark:divide-white/[0.05] overflow-hidden">
        {platformNotifications.map((notif) => (
          <div
            key={notif.notificationId}
            className={`p-5 flex items-start justify-between gap-4 transition-colors ${
              !notif.isRead
                ? 'bg-[#007AFF]/[0.02] dark:bg-[#007AFF]/[0.05]'
                : 'hover:bg-black/[0.01]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.type === 'error'
                    ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                    : notif.type === 'warning'
                    ? 'bg-[#FF9500]/10 text-[#FF9500]'
                    : notif.type === 'success'
                    ? 'bg-[#34C759]/10 text-[#34C759]'
                    : 'bg-[#007AFF]/10 text-[#007AFF]'
                }`}
              >
                {notif.type === 'error' && <ShieldAlert className="w-5 h-5" />}
                {notif.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                {notif.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {notif.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
                  )}
                </div>
                <p className="text-xs text-[#8E8E93] max-w-xl">
                  {notif.message}
                </p>
                <div className="text-[10px] text-[#8E8E93] flex items-center gap-2 pt-1 font-mono">
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  {notif.organizationName && (
                    <span>• Client: {notif.organizationName}</span>
                  )}
                </div>
              </div>
            </div>

            {!notif.isRead && (
              <button
                onClick={() => markNotificationRead(notif.notificationId)}
                className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#007AFF] hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Check className="w-3.5 h-3.5" /> Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
