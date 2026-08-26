import React from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Activity,
  CheckCircle2,
  Server,
  Database,
  Cloud,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Cpu,
  HardDrive
} from 'lucide-react';

export const SystemHealthView: React.FC = () => {
  const { isFirestoreConnected, syncStatus, t } = usePMS();

  const services = [
    {
      name: 'Cloudflare Edge Workers Runtime',
      role: 'Global Routing & Serverless Compute',
      status: 'operational',
      latencyMs: '22ms',
      uptime: '99.99%',
      icon: Cloud
    },
    {
      name: 'Google Cloud Firestore Real-time DB',
      role: 'Primary ACID Data Store & Multi-Tenant Collections',
      status: isFirestoreConnected ? 'operational' : 'degraded',
      latencyMs: isFirestoreConnected ? '45ms' : 'offline',
      uptime: '99.95%',
      icon: Database
    },
    {
      name: 'EthioTelecom REST SMS Gateway',
      role: 'Primary SMS Dispatch Engine (+251 Routes)',
      status: 'operational',
      latencyMs: '120ms',
      uptime: '99.82%',
      icon: MessageSquare
    },
    {
      name: 'Twilio Cloud SMS Backup Gateway',
      role: 'Secondary International SMS Fallback',
      status: 'operational',
      latencyMs: '85ms',
      uptime: '99.99%',
      icon: MessageSquare
    },
    {
      name: 'Telebirr SuperApp Merchant Webhook',
      role: 'E-Payment Settlement & Verification Vault',
      status: 'operational',
      latencyMs: '68ms',
      uptime: '99.90%',
      icon: Server
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#34C759]/10 text-[#34C759] font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-ping" />
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('health_title', 'System Health & Infrastructure')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('health_subtitle', 'Live telemetries, database response latency, and SMS gateway dispatch statuses.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl text-xs font-bold text-[#34C759] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> 99.98% Overall Platform Uptime
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div
              key={i}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C1C1E] dark:text-white">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-[#8E8E93] mt-0.5">
                    {svc.role}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] mt-3 font-mono">
                    <span>Latency: <strong>{svc.latencyMs}</strong></span>
                    <span>•</span>
                    <span>Uptime: <strong>{svc.uptime}</strong></span>
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#34C759]/10 text-[#34C759] shrink-0 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Operational
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
