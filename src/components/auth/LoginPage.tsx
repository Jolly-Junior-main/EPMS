import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { UserRole } from '../../types/pms';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Layers,
  Terminal,
  Globe
} from 'lucide-react';

interface RoleCredentialPreset {
  role: UserRole;
  label: string;
  sublabel: string;
  username: string;
  pass: string;
  name: string;
  title: string;
  destinationRoute: string;
  permissions: string[];
}

const PRESET_ACCOUNTS: Record<UserRole, RoleCredentialPreset> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    sublabel: 'Platform Control Plane',
    username: 'SuperAdmin',
    pass: '123',
    name: 'Super Administrator',
    title: 'Platform Architect & Owner',
    destinationRoute: '/superadmin',
    permissions: ['All Client Organizations', 'Subscriptions & Billing', 'Client Impersonation', 'Immutable Audit Logs']
  },
  owner: {
    role: 'owner',
    label: 'Owner',
    sublabel: 'Executive & Asset Owner',
    username: 'Owner',
    pass: '123',
    name: 'Abebe Mengesha',
    title: 'Managing Director & Property Owner',
    destinationRoute: '/owner',
    permissions: ['Revenue Analytics', 'Receipt Verification Vault', 'The Red List Overdue', 'Financial Ledger']
  },
  admin: {
    role: 'admin',
    label: 'Administrator',
    sublabel: 'Tech Partner & Architect',
    username: 'Admin',
    pass: '123',
    name: 'Dawit Alemu',
    title: 'Lead Firebase Cloud Architect',
    destinationRoute: '/admin',
    permissions: ['System Monitoring', 'Firebase Security Rules', 'Real-Time Database Sync', 'API Gateway Logs']
  },
  manager: {
    role: 'manager',
    label: 'Management',
    sublabel: 'Daily Field Operations',
    username: 'Manage',
    pass: '123',
    name: 'Hanna Tadesse',
    title: 'Senior Property Operations Manager',
    destinationRoute: '/manager',
    permissions: ['Tenant Directory', 'Lease Documents', 'Invoice Dispatch', 'Payment Receipt Logging', 'SMS Engine']
  },
  tenant: {
    role: 'tenant',
    label: 'Tenant Portal',
    sublabel: 'Commercial & Residential',
    username: 'Almaz Kebede',
    pass: '123',
    name: 'Almaz Kebede',
    title: 'Bole Coffee Roastery (Unit G-01)',
    destinationRoute: '/portal',
    permissions: ['Lease & Day Countdown', 'Upload Bank Payment Slip', 'Maintenance Dispatch', 'Digital QR Receipts']
  }
};

export const LoginPage: React.FC = () => {
  const { login, language, setLanguage, t } = usePMS();

  const [selectedPreset, setSelectedPreset] = useState<UserRole>('owner');
  const [username, setUsername] = useState<string>(PRESET_ACCOUNTS.owner.username);
  const [password, setPassword] = useState<string>(PRESET_ACCOUNTS.owner.pass);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Preset Switching
  const handleSelectPreset = (role: UserRole) => {
    setSelectedPreset(role);
    setUsername(PRESET_ACCOUNTS[role].username);
    setPassword(PRESET_ACCOUNTS[role].pass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentPreset = PRESET_ACCOUNTS[selectedPreset];

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-[#007AFF] selection:text-white">
      {/* Background Decorative Ambient Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top iOS Status Indicator Pill & Language Toggle */}
      <div className="mb-6 flex items-center justify-between gap-3 w-full max-w-md animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-[#1C1C1E]">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span>{t('auth_active')}</span>
        </div>

        <button
          id="login-lang-toggle-btn"
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-bold text-[#007AFF] hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English'}</span>
        </button>
      </div>

      {/* Main Centered Floating iOS Login Card */}
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/80 border border-black/[0.06] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-7 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* iOS App Icon & Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,122,255,0.35)] ring-4 ring-white/60">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">
              {t('login_title')}
            </h1>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              {t('login_subtitle')}
            </p>
          </div>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF3B30]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Username / Email Input */}
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1 px-1">
                {t('login_username')}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8E8E93] absolute left-4 pointer-events-none" />
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('login_username_placeholder')}
                  className="w-full bg-[#F2F2F7] focus:bg-white text-[#1C1C1E] rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-black/[0.04] font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1 px-1">
                {t('login_password')}
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8E8E93] absolute left-4 pointer-events-none" />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full bg-[#F2F2F7] focus:bg-white text-[#1C1C1E] rounded-xl pl-11 pr-11 py-3.5 text-sm focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-black/[0.04] font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-[#8E8E93] hover:text-[#1C1C1E] transition-colors rounded-lg cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between text-xs px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#3A3A3C]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#007AFF] focus:ring-[#007AFF] border-black/[0.15]"
              />
              <span>Remember session</span>
            </label>
            <div className="text-[11px] text-[#8E8E93]">
              Pass: <span className="font-mono text-[#007AFF] font-bold">123</span>
            </div>
          </div>

          {/* Primary iOS System Blue Sign-In Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#007AFF] text-white font-semibold rounded-xl py-3.5 hover:bg-[#0066D6] active:scale-[0.98] transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-sm cursor-pointer ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating with Firebase...</span>
              </>
            ) : (
              <>
                <span>{t('login_btn')} ({currentPreset.label})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Tenant Hint Callout */}
        <div className="p-3 bg-[#007AFF]/10 border border-[#007AFF]/20 rounded-2xl text-[11px] text-[#007AFF] leading-relaxed font-medium">
          {t('login_tenant_hint')}
        </div>

        {/* Quick Role Selector Buttons */}
        <div className="pt-2 border-t border-black/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
              {t('login_quick_creds')}
            </span>
            <span className="text-[10px] text-[#007AFF] font-mono font-medium">
              Pass: 123
            </span>
          </div>

          {/* iOS Segmented Control */}
          <div className="grid grid-cols-4 gap-1 bg-[#767680]/12 p-1 rounded-2xl">
            {(['owner', 'manager', 'tenant', 'admin'] as UserRole[]).map((r) => {
              const preset = PRESET_ACCOUNTS[r];
              const isSelected = selectedPreset === r;
              return (
                <button
                  key={r}
                  id={`preset-btn-${r}`}
                  type="button"
                  onClick={() => handleSelectPreset(r)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 text-center flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#1C1C1E] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5'
                      : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                  }`}
                >
                  <span className="font-bold text-[11px] truncate w-full">{preset.label.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-[#8E8E93] font-normal">{preset.username.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Role Access Scope Preview Banner */}
          <div className="p-3 bg-[#F2F2F7] rounded-2xl text-[11px] text-[#3A3A3C] space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-[#1C1C1E] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#007AFF]" />
                {currentPreset.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#007AFF]/15 text-[#007AFF] uppercase">
                {currentPreset.username} / 123
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {currentPreset.permissions.map((perm, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white text-[#1C1C1E] border border-black/[0.04] text-[10px] font-medium"
                >
                  • {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Real-Time Sync Info */}
        <div className="text-center">
          <p className="text-[10px] text-[#8E8E93] leading-relaxed">
            Connected to Cloud Firestore backend. Changes made by Owner, Administrator, or Management are synchronized live across all browsers.
          </p>
        </div>
      </div>
    </div>
  );
};
