import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Megaphone,
  Layers,
  ArrowRight,
  Globe
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { PlatformAdBanner } from '../../types/superAdmin';

export const AdBannersManager: React.FC = () => {
  const {
    adBanners,
    createAdBanner,
    deleteAdBanner,
    toggleAdBanner
  } = usePMS();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Learn More');
  const [ctaUrl, setCtaUrl] = useState('#');
  const [badgeText, setBadgeText] = useState('ANNOUNCEMENT');
  const [badgeColor, setBadgeColor] = useState('#007AFF');
  const [targetAudience, setTargetAudience] = useState<'all' | 'owner' | 'manager' | 'tenant'>('all');

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    createAdBanner({
      title,
      subtitle,
      ctaText,
      ctaUrl,
      badgeText,
      badgeColor,
      targetAudience,
      placement: 'dashboard_top',
      isActive: true
    });

    setTitle('');
    setSubtitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#1C1C1E]">
              Platform Ads & Announcements
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20">
              {adBanners.filter((b) => b.isActive).length} Active Banners
            </span>
          </div>
          <p className="text-sm text-[#8E8E93] mt-1">
            Broadcast promotional banners, product updates, and maintenance announcements across Client and Tenant portals.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Banner Ad
        </button>
      </div>

      {/* Active Live Banners List */}
      <div className="grid grid-cols-1 gap-4">
        {adBanners.map((ad) => (
          <div
            key={ad.adId}
            className={`p-6 rounded-3xl border transition-all ${
              ad.isActive
                ? 'bg-white/80 backdrop-blur-2xl border-black/[0.06] shadow-sm'
                : 'bg-white/40 border-black/[0.04] opacity-60'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {ad.badgeText && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: ad.badgeColor || '#007AFF' }}
                    >
                      {ad.badgeText}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-[#8E8E93] bg-[#F2F2F7] px-2.5 py-0.5 rounded-full border border-black/[0.04]">
                    Audience: <strong className="text-[#1C1C1E] capitalize">{ad.targetAudience}</strong>
                  </span>
                  <span className="text-[11px] font-semibold text-[#8E8E93] bg-[#F2F2F7] px-2.5 py-0.5 rounded-full border border-black/[0.04]">
                    Placement: <strong className="text-[#1C1C1E]">{ad.placement}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1C1C1E]">
                  {ad.title}
                </h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed">
                  {ad.subtitle}
                </p>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                {ad.ctaText && (
                  <span className="px-3 py-1 rounded-xl bg-[#F2F2F7] text-[#007AFF] text-xs font-bold flex items-center gap-1">
                    {ad.ctaText}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}

                <button
                  onClick={() => toggleAdBanner(ad.adId)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    ad.isActive
                      ? 'bg-[#34C759]/10 text-[#34C759] hover:bg-[#34C759]/20'
                      : 'bg-[#8E8E93]/10 text-[#8E8E93] hover:bg-[#8E8E93]/20'
                  }`}
                >
                  {ad.isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active (Live)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Disabled
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteAdBanner(ad.adId)}
                  className="p-2 rounded-xl text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-all"
                  title="Delete Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {adBanners.length === 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 text-center border border-black/[0.06]">
            <Megaphone className="w-12 h-12 text-[#8E8E93] mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-base text-[#1C1C1E]">No Ad Banners Configured</h3>
            <p className="text-xs text-[#8E8E93] mt-1 max-w-md mx-auto">
              Create announcements, feature updates, or commercial offers to broadcast across client dashboards.
            </p>
          </div>
        )}
      </div>

      {/* Create Banner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-black/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#1C1C1E]">Create Platform Ad / Announcement</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8E8E93] hover:text-[#1C1C1E] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                  Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ⚡ Telebirr Instant Pay integration is now live"
                  className="w-full bg-[#F2F2F7] rounded-2xl px-4 py-2 text-xs font-semibold text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Tenants can now settle rent directly via Telebirr QR scan..."
                  className="w-full bg-[#F2F2F7] rounded-2xl p-3 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="FEATURED"
                    className="w-full bg-[#F2F2F7] rounded-2xl px-3 py-2 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                    Badge Color
                  </label>
                  <select
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-full bg-[#F2F2F7] rounded-2xl px-3 py-2 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                  >
                    <option value="#007AFF">Blue (#007AFF)</option>
                    <option value="#34C759">Green (#34C759)</option>
                    <option value="#FF9500">Orange (#FF9500)</option>
                    <option value="#AF52DE">Purple (#AF52DE)</option>
                    <option value="#FF2D55">Pink (#FF2D55)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Explore Now"
                    className="w-full bg-[#F2F2F7] rounded-2xl px-3 py-2 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C1C1E] mb-1">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-[#F2F2F7] rounded-2xl px-3 py-2 text-xs text-[#1C1C1E] border border-transparent focus:bg-white focus:border-[#007AFF] outline-none"
                  >
                    <option value="all">All Users (Platform-wide)</option>
                    <option value="owner">Owners Only</option>
                    <option value="manager">Property Managers Only</option>
                    <option value="tenant">Tenants Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-2xl bg-[#F2F2F7] text-[#1C1C1E] text-xs font-bold hover:bg-[#E5E5EA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
