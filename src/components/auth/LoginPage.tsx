import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { UserRole } from '../../types/pms';
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe,
  Briefcase,
  Store,
  Layers
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, language, setLanguage, t } = usePMS();

  // Login Mode: 'client' (Client EPMS Portal) vs 'super_admin' (Platform Super Admin)
  const [loginMode, setLoginMode] = useState<'client' | 'super_admin'>('client');
  const [username, setUsername] = useState<string>('BoleOwner');
  const [password, setPassword] = useState<string>('123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleModeChange = (mode: 'client' | 'super_admin') => {
    setLoginMode(mode);
    setErrorMessage(null);
    if (mode === 'super_admin') {
      setUsername('SuperAdmin');
      setPassword('123');
    } else {
      setUsername('BoleOwner');
      setPassword('123');
    }
  };

  const handleQuickClientSelect = (uname: string) => {
    setUsername(uname);
    setPassword('123');
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

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden font-sans selection:bg-[#007AFF] selection:text-white">
      {/* Background Decorative Ambient Spheres */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top iOS Status Indicator Pill & Language Toggle */}
      <div className="mb-6 flex items-center justify-between gap-3 w-full max-w-md animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-sm text-xs font-semibold text-[#1C1C1E]">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span>{t('auth_active', 'EPMS Cloud Gateway Online')}</span>
        </div>

        <button
          id="login-lang-toggle-btn"
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] shadow-sm text-xs font-bold text-[#007AFF] hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English'}</span>
        </button>
      </div>

      {/* Main Centered Floating iOS Login Card */}
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/90 border border-black/[0.06] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8 space-y-5 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-white">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1E]">
              {loginMode === 'super_admin' ? 'EPMS Super Admin' : 'Enterprise PMS Login'}
            </h1>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              {loginMode === 'super_admin'
                ? 'Centralized Multi-Tenant SaaS Control Plane'
                : 'Commercial Property Management System for Building Owners & Managers'}
            </p>
          </div>
        </div>

        {/* Portal Switcher Tabs: Client EPMS vs Super Admin */}
        <div className="grid grid-cols-2 gap-1 bg-[#767680]/12 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => handleModeChange('client')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              loginMode === 'client'
                ? 'bg-white text-[#1C1C1E] shadow-sm ring-1 ring-black/5'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Client EPMS</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('super_admin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              loginMode === 'super_admin'
                ? 'bg-[#007AFF] text-white shadow-sm ring-1 ring-blue-600'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Error Callout */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-[#FF3B30] text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF3B30]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Username */}
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1 px-1">
                {loginMode === 'super_admin' ? 'Super Admin Username' : 'Username / Property Account'}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8E8E93] absolute left-4 pointer-events-none" />
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={loginMode === 'super_admin' ? 'SuperAdmin' : 'e.g. BoleOwner, KazanchisOwner...'}
                  className="w-full bg-[#F2F2F7] focus:bg-white text-[#1C1C1E] rounded-xl pl-11 pr-4 py-3 text-xs focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-black/[0.04] font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider block mb-1 px-1">
                {t('login_password', 'Password')}
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
                  className="w-full bg-[#F2F2F7] focus:bg-white text-[#1C1C1E] rounded-xl pl-11 pr-11 py-3 text-xs focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-black/[0.04] font-medium font-mono"
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

          {/* Options */}
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
              Default Password: <span className="font-mono text-[#007AFF] font-bold">123</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#007AFF] text-white font-semibold rounded-xl py-3 hover:bg-[#0066D6] active:scale-[0.98] transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 text-xs cursor-pointer ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating with EPMS...</span>
              </>
            ) : (
              <>
                <span>Sign In to {loginMode === 'super_admin' ? 'Super Admin' : 'EPMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 4 Client Property Directory Reference */}
        {loginMode === 'client' && (
          <div className="pt-3 border-t border-black/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
                Client Property Accounts (Pass: 123)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {/* Client 1: Bole Plaza */}
              <div className="p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.04] space-y-1">
                <div className="font-bold text-[#1C1C1E] flex items-center gap-1 text-[10px]">
                  <Store className="w-3 h-3 text-[#007AFF]" />
                  <span>1. Bole Plaza</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('BoleOwner')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#007AFF] hover:bg-blue-50"
                    title="Click to fill BoleOwner"
                  >
                    BoleOwner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('BoleManager')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-50"
                    title="Click to fill BoleManager"
                  >
                    BoleManager
                  </button>
                </div>
              </div>

              {/* Client 2: Kazanchis Towers */}
              <div className="p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.04] space-y-1">
                <div className="font-bold text-[#1C1C1E] flex items-center gap-1 text-[10px]">
                  <Building2 className="w-3 h-3 text-[#5856D6]" />
                  <span>2. Kazanchis Tower</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('KazanchisOwner')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#007AFF] hover:bg-blue-50"
                    title="Click to fill KazanchisOwner"
                  >
                    KazanchisOwner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('KazanchisManager')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-50"
                    title="Click to fill KazanchisManager"
                  >
                    KazanchisManager
                  </button>
                </div>
              </div>

              {/* Client 3: Sarbet Mall */}
              <div className="p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.04] space-y-1">
                <div className="font-bold text-[#1C1C1E] flex items-center gap-1 text-[10px]">
                  <Store className="w-3 h-3 text-[#AF52DE]" />
                  <span>3. Sarbet Mall</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('SarbetOwner')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#007AFF] hover:bg-blue-50"
                    title="Click to fill SarbetOwner"
                  >
                    SarbetOwner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('SarbetManager')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-50"
                    title="Click to fill SarbetManager"
                  >
                    SarbetManager
                  </button>
                </div>
              </div>

              {/* Client 4: CMC Mega Hub */}
              <div className="p-2.5 rounded-xl bg-[#F2F2F7] border border-black/[0.04] space-y-1">
                <div className="font-bold text-[#1C1C1E] flex items-center gap-1 text-[10px]">
                  <Briefcase className="w-3 h-3 text-[#FF9500]" />
                  <span>4. CMC Hub</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('CmcOwner')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#007AFF] hover:bg-blue-50"
                    title="Click to fill CmcOwner"
                  >
                    CmcOwner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickClientSelect('CmcManager')}
                    className="px-1.5 py-0.5 rounded bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-50"
                    title="Click to fill CmcManager"
                  >
                    CmcManager
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Super Admin Info */}
        {loginMode === 'super_admin' && (
          <div className="p-3 rounded-2xl bg-[#007AFF]/10 border border-[#007AFF]/20 text-xs space-y-1 text-[#007AFF]">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Platform Owner Credentials</span>
            </div>
            <p className="text-[11px] text-[#3A3A3C] leading-relaxed">
              Username: <strong className="font-mono text-[#007AFF]">SuperAdmin</strong> &bull; Password: <strong className="font-mono text-[#007AFF]">123</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
