import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import {
  Layers,
  Building2,
  Search,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export const GlobalBuildingsManager: React.FC = () => {
  const { properties, units, organizations, startImpersonation, t } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>('all');

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.propertyId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrg =
      selectedOrgFilter === 'all' || prop.organizationId === selectedOrgFilter;

    return matchesSearch && matchesOrg;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              PORTFOLIO-WIDE ASSETS &amp; SPACES
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('global_buildings_title', 'Portfolio Buildings Directory')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('global_buildings_subtitle', 'Browse all commercial complexes, mixed-use properties, and unit distributions across clients.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-[#1C1C1E] dark:text-white">
              {properties.length}
            </div>
            <div className="text-[10px] text-[#8E8E93] uppercase font-bold">Total Properties</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3.5 border border-black/[0.04] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search building name, location, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <select
          value={selectedOrgFilter}
          onChange={(e) => setSelectedOrgFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white font-semibold focus:outline-none cursor-pointer"
        >
          <option value="all">All Client Organizations</option>
          {organizations.map((org) => (
            <option key={org.organizationId} value={org.organizationId}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buildings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => {
          const propUnits = units.filter((u) => u.propertyId === prop.propertyId);
          const occupied = propUnits.filter((u) => u.status === 'occupied').length;
          const occupancyRate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : prop.occupancyRate;
          const org = organizations.find((o) => o.organizationId === prop.organizationId);

          return (
            <div
              key={prop.propertyId}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl overflow-hidden border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group hover:border-[#007AFF]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-40 relative overflow-hidden bg-black/5">
                  <img
                    src={prop.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'}
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                    {prop.type}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#007AFF]" />
                    {org ? org.name : 'Bole Medhanialem Commercial Center'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#1C1C1E] dark:text-white">
                      {prop.name}
                    </h3>
                    <div className="text-xs text-[#8E8E93] flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{prop.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-black/[0.05] dark:border-white/10 text-center text-xs">
                    <div>
                      <div className="text-[#8E8E93] text-[10px] uppercase font-bold">Total Units</div>
                      <div className="font-bold text-[#1C1C1E] dark:text-white mt-0.5">
                        {prop.totalUnits}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#8E8E93] text-[10px] uppercase font-bold">Occupied</div>
                      <div className="font-bold text-[#34C759] mt-0.5">
                        {occupied || prop.occupiedUnits}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#8E8E93] text-[10px] uppercase font-bold">Occupancy</div>
                      <div className="font-bold text-[#007AFF] mt-0.5">
                        {occupancyRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                {org && (
                  <button
                    onClick={() => startImpersonation(org.organizationId)}
                    className="w-full py-2.5 rounded-2xl bg-[#007AFF]/10 hover:bg-[#007AFF] hover:text-white text-[#007AFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in Client Environment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
