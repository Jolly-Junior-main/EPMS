import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Settings,
  ShieldCheck,
  Mail,
  Server,
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export const PlatformSettingsView: React.FC = () => {
  const { platformSettings, updatePlatformSettings, t } = usePMS();

  const [settings, setSettings] = useState(platformSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(settings);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              GLOBAL SYSTEM CONFIGURATION
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('settings_title', 'Platform Settings & Governance')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('settings_subtitle', 'Global SaaS platform branding, security policies, SMS integrations, and maintenance windows.')}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" /> Save Global Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white uppercase tracking-wider text-[#8E8E93] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#007AFF]" /> Platform Identity &amp; Defaults
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, platformName: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Support Email Contact</label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, supportEmail: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Base Currency</label>
              <input
                type="text"
                disabled
                value={settings.general.defaultCurrency}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] opacity-70 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Default Timezone</label>
              <input
                type="text"
                value={settings.general.defaultTimezone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultTimezone: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white uppercase tracking-wider text-[#8E8E93] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#007AFF]" /> Security &amp; Access Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeoutMinutes}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Max Login Attempts</label>
              <input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, maxLoginAttempts: Number(e.target.value) }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="mfa"
                checked={settings.security.enforceMFA}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: { ...settings.security, enforceMFA: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-[#007AFF] rounded"
              />
              <label htmlFor="mfa" className="font-semibold cursor-pointer">
                Enforce Multi-Factor Authentication
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-[#FF9500] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF9500]" /> Maintenance Mode Window
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maint"
              checked={settings.maintenance.maintenanceMode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, maintenanceMode: e.target.checked }
                })
              }
              className="w-4 h-4 accent-[#FF9500] rounded"
            />
            <label htmlFor="maint" className="text-xs font-semibold text-[#1C1C1E] dark:text-white cursor-pointer">
              Enable Platform-Wide Maintenance Mode (Locks Client Access)
            </label>
          </div>

          {settings.maintenance.maintenanceMode && (
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold block">Public Maintenance Message</label>
              <input
                type="text"
                value={settings.maintenance.message}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenance: { ...settings.maintenance, message: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
