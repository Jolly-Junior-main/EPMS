import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Globe,
  Briefcase,
  Store
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, language, setLanguage, t } = usePMS();

  const [username, setUsername] = useState<string>('BoleOwner');
  const [password, setPassword] = useState<string>('123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleQuickClientSelect = async (uname: string) => {
    setUsername(uname);
    setPassword('123');
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const result = await login(uname, '123');
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your property account username and password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your property account username and password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-10 font-sans selection:bg-[#007AFF] selection:text-white overflow-y-auto">
      {/* High-Resolution Modern Architectural Buildings Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2160&q=85')`
        }}
      />

      {/* Atmospheric Glassmorphism Gradient & Dark Contrast Overlay */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[5px] z-0" />

      {/* Background Decorative Ambient Spheres */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top iOS Status Indicator Pill & Language Toggle */}
      <div className="mb-6 flex items-center justify-between gap-3 w-full max-w-md animate-in fade-in slide-in-from-top-3 duration-300 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/20 shadow-md text-xs font-semibold text-[#1C1C1E]">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span>{t('auth_active', 'EPMS Cloud Gateway Online')}</span>
        </div>

        <button
          id="login-lang-toggle-btn"
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/20 shadow-md text-xs font-bold text-[#007AFF] hover:bg-white transition-all active:scale-95 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{language === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English'}</span>
        </button>
      </div>

      {/* Main Centered Floating iOS Login Card */}
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/95 border border-white/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] p-6 sm:p-8 space-y-5 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-white">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1C1E]">
              Commercial PMS Login
            </h1>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Property Management Portal for Commercial Building Owners &amp; Property Managers
            </p>
          </div>
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
                Property Account / Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8E8E93] absolute left-4 pointer-events-none" />
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. BoleOwner, KazanchisOwner..."
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
                <span>Authenticating with Property Gateway...</span>
              </>
            ) : (
              <>
                <span>Sign In to Building Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 4 Client Property Directory Quick Access */}
        <div className="pt-3 border-t border-black/[0.06] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              Client Property Portals (Pass: 123)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Client 1: Bole Plaza */}
            <div className="p-2.5 rounded-2xl bg-blue-50/50 border border-[#007AFF]/20 space-y-1.5 shadow-sm">
              <div className="font-bold text-[#1C1C1E] flex items-center gap-1.5 text-[10px]">
                <Store className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>1. Bole Plaza</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('BoleOwner')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#007AFF] hover:bg-blue-100 shadow-sm border border-[#007AFF]/10 cursor-pointer"
                  title="Click to select BoleOwner"
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('BoleManager')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-100 shadow-sm border border-green-500/10 cursor-pointer"
                  title="Click to select BoleManager"
                >
                  Manager
                </button>
              </div>
            </div>

            {/* Client 2: Kazanchis Towers */}
            <div className="p-2.5 rounded-2xl bg-emerald-50/50 border border-[#059669]/20 space-y-1.5 shadow-sm">
              <div className="font-bold text-[#1C1C1E] flex items-center gap-1.5 text-[10px]">
                <Building2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>2. Kazanchis Tower</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('KazanchisOwner')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#059669] hover:bg-emerald-100 shadow-sm border border-[#059669]/10 cursor-pointer"
                  title="Click to select KazanchisOwner"
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('KazanchisManager')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-100 shadow-sm border border-green-500/10 cursor-pointer"
                  title="Click to select KazanchisManager"
                >
                  Manager
                </button>
              </div>
            </div>

            {/* Client 3: Sarbet Mall */}
            <div className="p-2.5 rounded-2xl bg-purple-50/50 border border-[#7C3AED]/20 space-y-1.5 shadow-sm">
              <div className="font-bold text-[#1C1C1E] flex items-center gap-1.5 text-[10px]">
                <Store className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>3. Sarbet Mall</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('SarbetOwner')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#7C3AED] hover:bg-purple-100 shadow-sm border border-[#7C3AED]/10 cursor-pointer"
                  title="Click to select SarbetOwner"
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('SarbetManager')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-100 shadow-sm border border-green-500/10 cursor-pointer"
                  title="Click to select SarbetManager"
                >
                  Manager
                </button>
              </div>
            </div>

            {/* Client 4: CMC Mega Hub */}
            <div className="p-2.5 rounded-2xl bg-orange-50/50 border border-[#EA580C]/20 space-y-1.5 shadow-sm">
              <div className="font-bold text-[#1C1C1E] flex items-center gap-1.5 text-[10px]">
                <Briefcase className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>4. CMC Hub</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('CmcOwner')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#EA580C] hover:bg-orange-100 shadow-sm border border-[#EA580C]/10 cursor-pointer"
                  title="Click to select CmcOwner"
                >
                  Owner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickClientSelect('CmcManager')}
                  className="px-2 py-1 rounded-lg bg-white font-mono font-bold text-[9px] text-[#34C759] hover:bg-green-100 shadow-sm border border-green-500/10 cursor-pointer"
                  title="Click to select CmcManager"
                >
                  Manager
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-center text-[#8E8E93] pt-1">
            ✨ Newly created organization? Log in with your <strong>Organization Name</strong> (e.g. <em>[Name]Owner</em>), <strong>Admin Email</strong>, or <strong>Phone</strong> with password <strong>123</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
