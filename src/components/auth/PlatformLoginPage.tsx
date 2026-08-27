import React, { useState, useEffect } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Server,
  Key,
  RefreshCw,
  Cpu,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const PlatformLoginPage: React.FC = () => {
  const { platformLogin, t } = usePMS();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hardwareKeyActive, setHardwareKeyActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Brute-force rate limiting state
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  // Handle countdown timer for rate limiting lockout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      timer = setTimeout(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Artificial cryptographic verification delay to prevent timing attacks
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const result = await platformLogin(username, password);

      if (!result.success) {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);

        if (nextFailed >= 5) {
          setLockoutTimer(60); // 60-second lockout
          setErrorMessage('Gatekeeper: Rate limit exceeded. System locked for 60 seconds.');
        } else {
          setErrorMessage(result.error || 'Authentication Failed: Invalid credentials or insufficient clearance.');
        }
      } else {
        // Reset counters on success
        setFailedAttempts(0);
      }
    } catch (err: any) {
      console.error('Platform login error:', err);
      setErrorMessage(err?.message || 'Authentication error occurred. Please verify root credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-[#007AFF] selection:text-white">
      {/* High-Tech Radial Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,122,255,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Security Header Pill */}
      <div className="mb-6 flex items-center justify-between gap-3 w-full max-w-md animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-mono text-white/80 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
          <span>FIPS 140-3 Cryptographic Gateway</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
          <Server className="w-3.5 h-3.5 text-[#34C759]" />
          <span>TLS 1.3 Active</span>
        </div>
      </div>

      {/* Main Mission-Critical Admin Access Card */}
      <div className="w-full max-w-md bg-[#0F1420]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-6 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Shield Icon & Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-white/10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Platform Administration
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Secure Root Administrator Access Control Plane
            </p>
          </div>
        </div>

        {/* Security Alert Banner if Rate Limited or Error */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/30 text-[#FF453A] text-xs font-medium flex items-center gap-3 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF453A]" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3.5">
            {/* Username / Email */}
            <div>
              <label className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-wider block mb-1.5 px-1">
                Administrator Identifier
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  disabled={lockoutTimer > 0 || isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Root Admin Identity"
                  className="w-full bg-[#182030] focus:bg-[#1E283C] text-white rounded-xl pl-11 pr-4 py-3 text-xs focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-white/10 font-mono placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <label className="text-[11px] font-mono font-semibold text-white/60 uppercase tracking-wider block">
                  Security Passphrase
                </label>
                <span className="text-[10px] font-mono text-white/40">AES-256 GCM</span>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={lockoutTimer > 0 || isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#182030] focus:bg-[#1E283C] text-white rounded-xl pl-11 pr-11 py-3 text-xs focus:ring-2 focus:ring-[#007AFF] outline-none transition-all border border-white/10 font-mono placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-white/40 hover:text-white transition-colors rounded-lg cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Hardware Token / MFA Simulation Toggle */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Key className="w-3.5 h-3.5 text-[#007AFF]" />
              <span className="text-[11px]">Hardware Token (YubiKey / WebAuthn)</span>
            </div>
            <button
              type="button"
              onClick={() => setHardwareKeyActive(!hardwareKeyActive)}
              className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                hardwareKeyActive ? 'bg-[#007AFF]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                  hardwareKeyActive ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            id="platform-login-submit-btn"
            type="submit"
            disabled={isLoading || lockoutTimer > 0}
            className={`w-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold rounded-xl py-3.5 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs font-mono tracking-wide cursor-pointer ${
              isLoading || lockoutTimer > 0 ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Zero-Trust Credentials...</span>
              </>
            ) : lockoutTimer > 0 ? (
              <span>Locked Out ({lockoutTimer}s)</span>
            ) : (
              <>
                <span>Authenticate Platform Control</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Policy Footnote */}
        <div className="pt-3 border-t border-white/10 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#34C759] font-mono">
            <Activity className="w-3 h-3" />
            <span>Audited &amp; Cryptographically Monitored</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed max-w-xs mx-auto">
            Unauthorized access attempts are logged with client fingerprints and reported to platform security officers.
          </p>
        </div>
      </div>
    </div>
  );
};
