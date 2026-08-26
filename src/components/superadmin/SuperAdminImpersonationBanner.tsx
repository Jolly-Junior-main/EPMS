import React from 'react';
import { usePMS } from '../../context/PMSContext';
import { ShieldAlert, LogOut, ExternalLink, Clock, Building2 } from 'lucide-react';

export const SuperAdminImpersonationBanner: React.FC = () => {
  const { impersonationContext, exitImpersonation, t } = usePMS();

  if (!impersonationContext || !impersonationContext.isImpersonating) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-[#FF9500] text-black px-4 py-2.5 shadow-md flex items-center justify-between gap-4 border-b border-black/10 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
          <ShieldAlert className="w-4 h-4 text-[#FF9500]" />
        </div>
        <div className="text-xs">
          <div className="font-bold flex items-center gap-2 tracking-wide uppercase">
            <span>{t('super_admin_impersonating', 'SUPER ADMIN ACCESS MODE')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
          </div>
          <div className="text-[11px] font-medium text-black/80 flex items-center gap-1.5 mt-0.5">
            <span>{t('super_admin_viewing_org', 'You are currently viewing client environment:')}</span>
            <span className="font-bold underline flex items-center gap-1">
              <Building2 className="w-3 h-3 inline" />
              {impersonationContext.targetOrganizationName}
            </span>
            <span className="text-black/60 hidden sm:inline">
              • Started at {new Date(impersonationContext.startedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={exitImpersonation}
        className="px-3.5 py-1.5 bg-black hover:bg-black/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
      >
        <LogOut className="w-3.5 h-3.5 text-[#FF9500]" />
        {t('super_admin_exit_impersonation', 'Exit Client Environment')}
      </button>
    </div>
  );
};
