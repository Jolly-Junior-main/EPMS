import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { Tenant, TenantStatus, TenantDocument } from '../../types/pms';
import {
  Users,
  Plus,
  Search,
  FileText,
  Upload,
  Calendar,
  Phone,
  Mail,
  Building,
  Edit2,
  Trash2,
  Lock,
  Download,
  CheckCircle,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';

export const TenantsManager: React.FC = () => {
  const {
    tenants,
    units,
    currentUser,
    addTenant,
    updateTenant,
    deleteTenant,
    uploadTenantDocument,
    t
  } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TenantStatus>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [selectedTenantForDocs, setSelectedTenantForDocs] = useState<Tenant | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    legalName: '',
    businessTradeName: '',
    phone: '+251',
    email: '',
    assignedUnitId: units.find((u) => u.status === 'vacant')?.unitId || units[0]?.unitId || '',
    propertyId: units[0]?.propertyId || '',
    leaseStartDate: '2026-08-01',
    leaseEndDate: '2028-07-31',
    status: 'active' as TenantStatus,
    monthlyRentETB: 120000,
    securityDepositETB: 360000,
    tinNumber: '',
    contactPerson: '',
    emergencyContact: '',
    notes: ''
  });

  // Doc upload state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<TenantDocument['type']>('lease_agreement');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  const isOwnerOrAdmin = ['owner', 'admin'].includes(currentUser.role);

  const filteredTenants = tenants.filter((t_item) => {
    const matchesSearch =
      t_item.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t_item.phone.includes(searchTerm) ||
      t_item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t_item.businessTradeName && t_item.businessTradeName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && t_item.status !== statusFilter) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    const vacantUnit = units.find((u) => u.status === 'vacant');
    setFormData({
      legalName: '',
      businessTradeName: '',
      phone: '+251',
      email: '',
      assignedUnitId: vacantUnit ? vacantUnit.unitId : units[0]?.unitId || '',
      propertyId: vacantUnit ? vacantUnit.propertyId : units[0]?.propertyId || '',
      leaseStartDate: '2026-08-01',
      leaseEndDate: '2028-07-31',
      status: 'active',
      monthlyRentETB: vacantUnit ? vacantUnit.monthlyBaseRentETB : 120000,
      securityDepositETB: vacantUnit ? vacantUnit.monthlyBaseRentETB * 3 : 360000,
      tinNumber: '',
      contactPerson: '',
      emergencyContact: '',
      notes: ''
    });
    setEditingTenant(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (t_tenant: Tenant) => {
    setEditingTenant(t_tenant);
    setFormData({
      legalName: t_tenant.legalName,
      businessTradeName: t_tenant.businessTradeName || '',
      phone: t_tenant.phone,
      email: t_tenant.email,
      assignedUnitId: t_tenant.assignedUnitId,
      propertyId: t_tenant.propertyId,
      leaseStartDate: t_tenant.leaseStartDate,
      leaseEndDate: t_tenant.leaseEndDate,
      status: t_tenant.status,
      monthlyRentETB: t_tenant.monthlyRentETB,
      securityDepositETB: t_tenant.securityDepositETB,
      tinNumber: t_tenant.tinNumber || '',
      contactPerson: t_tenant.contactPerson || '',
      emergencyContact: t_tenant.emergencyContact || '',
      notes: t_tenant.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTenant) {
      updateTenant(editingTenant.tenantId, formData);
    } else {
      addTenant(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleDeleteTenant = (t_tenant: Tenant) => {
    setTenantToDelete(t_tenant);
  };

  const confirmDeleteTenant = () => {
    if (tenantToDelete) {
      deleteTenant(tenantToDelete.tenantId);
      setTenantToDelete(null);
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForDocs || !docName.trim()) return;

    setIsUploadingDoc(true);
    setTimeout(() => {
      uploadTenantDocument(selectedTenantForDocs.tenantId, {
        name: docName,
        type: docType,
        storagePath: `tenants/${selectedTenantForDocs.tenantId}/documents/${docName.replace(/\s+/g, '_')}`,
        downloadUrl: '#',
        sizeBytes: Math.floor(Math.random() * 2000000) + 500000,
        mimeType: docName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
      });

      // Refresh current active modal tenant
      const updated = tenants.find((t_item) => t_item.tenantId === selectedTenantForDocs.tenantId);
      if (updated) setSelectedTenantForDocs(updated);

      setDocName('');
      setIsUploadingDoc(false);
    }, 800);
  };

  return (
    <div id="tenants-manager-view" className="space-y-6">
      {/* iOS Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              {t('nav_tenants')}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E]">{t('tenants_title')}</h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('tenants_subtitle')}
          </p>
        </div>

        <button
          id="add-tenant-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-2xl text-xs font-semibold transition-all shadow-[0_4px_12px_rgba(0,122,255,0.3)] flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t('tenants_add_btn')}
        </button>
      </div>

      {/* iOS Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl p-3 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5" />
          <input
            type="text"
            placeholder={t('tenants_search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#767680]/12 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-[#1C1C1E] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            {t('tenants_status_all')} ({tenants.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-white text-[#34C759] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('pending_renewal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              statusFilter === 'pending_renewal'
                ? 'bg-white text-[#FF9500] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Pending Renewal
          </button>
          <button
            onClick={() => setStatusFilter('delinquent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              statusFilter === 'delinquent'
                ? 'bg-white text-[#FF3B30] shadow-[0_2px_6px_rgba(0,0,0,0.12)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            Delinquent
          </button>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTenants.map((t) => {
          const assignedUnit = units.find((u) => u.unitId === t.assignedUnitId);

          return (
            <div
              key={t.tenantId}
              className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 space-y-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Status & Trade Name */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'active'
                        ? 'bg-[#34C759]/15 text-[#34C759]'
                        : t.status === 'pending_renewal'
                        ? 'bg-[#FF9500]/15 text-[#FF9500]'
                        : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-[#8E8E93]">ID: {t.tenantId}</span>
                </div>

                <h3 className="font-bold text-[#1C1C1E] text-base tracking-tight leading-snug">
                  {t.legalName}
                </h3>
                {t.businessTradeName && (
                  <div className="text-xs font-medium text-[#007AFF] mt-0.5">
                    d/b/a {t.businessTradeName}
                  </div>
                )}

                {/* Assigned Unit & Rent in iOS Grouped Box */}
                <div className="mt-3.5 p-4 rounded-2xl bg-[#F2F2F7] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93] font-medium">Assigned Unit:</span>
                    <strong className="text-[#1C1C1E] font-semibold">{assignedUnit?.unitNumber || 'Unassigned'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E8E93] font-medium">Monthly Rent:</span>
                    <strong className="text-[#1C1C1E] font-bold">{t.monthlyRentETB.toLocaleString()} ETB</strong>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#8E8E93] pt-1.5 border-t border-black/[0.05]">
                    <span>Lease Term:</span>
                    <span className="font-mono">{t.leaseStartDate} to {t.leaseEndDate}</span>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="mt-3.5 space-y-1 text-xs text-[#3A3A3C]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
                    <span className="font-mono">{t.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#8E8E93] shrink-0" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  {t.tinNumber && (
                    <div className="text-[11px] text-[#8E8E93] font-mono">
                      TIN: {t.tinNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bottom Bar */}
              <div className="pt-3.5 border-t border-black/[0.05] flex items-center justify-between">
                <button
                  onClick={() => setSelectedTenantForDocs(t)}
                  className="px-3 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-[#007AFF]" />
                  Docs ({t.documents?.length || 0})
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(t)}
                    title="Edit Tenant"
                    className="p-2 rounded-xl hover:bg-[#F2F2F7] text-[#007AFF] transition-colors active:scale-95"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteTenant(t)}
                    title={isOwnerOrAdmin ? 'Delete Tenant' : 'Delete requires Owner role'}
                    disabled={!isOwnerOrAdmin}
                    className={`p-2 rounded-xl transition-colors active:scale-95 ${
                      isOwnerOrAdmin
                        ? 'hover:bg-[#FF3B30]/10 text-[#FF3B30]'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Tenant Modal Sheet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
              <h3 className="font-bold text-base text-[#1C1C1E]">
                {editingTenant ? 'Edit Tenant Record' : 'Register New Tenant in Firestore'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-[#1C1C1E] block mb-1">Legal Registered Entity Name</label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="e.g. Abyssinia Specialty Coffee Exporters PLC"
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Trade Name / Brand (Optional)</label>
                <input
                  type="text"
                  value={formData.businessTradeName}
                  onChange={(e) => setFormData({ ...formData, businessTradeName: e.target.value })}
                  placeholder="e.g. Abyssinia Roast & Cafe"
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Tax Identification Number (TIN)</label>
                <input
                  type="text"
                  value={formData.tinNumber}
                  onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                  placeholder="0098421458"
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Phone Number (+251 format)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Official Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Assign Unit</label>
                <select
                  value={formData.assignedUnitId}
                  onChange={(e) => {
                    const selected = units.find((u) => u.unitId === e.target.value);
                    setFormData({
                      ...formData,
                      assignedUnitId: e.target.value,
                      propertyId: selected ? selected.propertyId : formData.propertyId,
                      monthlyRentETB: selected ? selected.monthlyBaseRentETB : formData.monthlyRentETB,
                      securityDepositETB: selected ? selected.monthlyBaseRentETB * 3 : formData.securityDepositETB
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  {units.map((u) => (
                    <option key={u.unitId} value={u.unitId}>
                      {u.unitNumber} ({u.propertyName}) - {u.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TenantStatus })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-medium"
                >
                  <option value="active">Active</option>
                  <option value="pending_renewal">Pending Renewal</option>
                  <option value="delinquent">Delinquent</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Monthly Base Rent (ETB)</label>
                <input
                  type="number"
                  value={formData.monthlyRentETB}
                  onChange={(e) => setFormData({ ...formData, monthlyRentETB: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Security Deposit (ETB)</label>
                <input
                  type="number"
                  value={formData.securityDepositETB}
                  onChange={(e) => setFormData({ ...formData, securityDepositETB: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Lease Start Date</label>
                <input
                  type="date"
                  value={formData.leaseStartDate}
                  onChange={(e) => setFormData({ ...formData, leaseStartDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-[#1C1C1E] block mb-1">Lease End Date</label>
                <input
                  type="date"
                  value={formData.leaseEndDate}
                  onChange={(e) => setFormData({ ...formData, leaseEndDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-[#F2F2F7] text-[#1C1C1E] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007AFF] font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/[0.05]">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8E8E93] hover:bg-[#F2F2F7] active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-md active:scale-95 transition-all"
              >
                {editingTenant ? 'Save Changes' : 'Register Tenant'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tenant Document Vault Modal */}
      {selectedTenantForDocs && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-black/[0.06] animate-in fade-in zoom-in-95 duration-200">
            {/* Grabber Bar */}
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-black/[0.05] pb-3.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] font-mono">
                  Firebase Storage Bucket: gs://enterprise-pms-et.appspot.com
                </span>
                <h3 className="font-bold text-base text-[#1C1C1E]">
                  Document Vault: {selectedTenantForDocs.legalName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTenantForDocs(null)}
                className="p-2 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Upload Form */}
            <form onSubmit={handleUploadDocSubmit} className="p-4 bg-[#F2F2F7] rounded-2xl border border-black/[0.04] space-y-3">
              <div className="text-xs font-semibold text-[#1C1C1E] flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#007AFF]" />
                Upload New Contract or Certificate to Storage
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="e.g. Master Lease 2026-2028.pdf or Trade_License.png"
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-white text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF] font-medium"
                    required
                  />
                </div>

                <div>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-black/[0.06] bg-white text-[#1C1C1E] focus:outline-none focus:ring-2 focus:ring-[#007AFF] font-medium"
                  >
                    <option value="lease_agreement">Lease Agreement</option>
                    <option value="tax_registration">Tax/TIN Certificate</option>
                    <option value="business_license">Business License</option>
                    <option value="id_card">National ID</option>
                    <option value="other">Other Document</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="px-4 py-2 bg-[#007AFF] hover:bg-[#0062CC] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingDoc ? 'Uploading to Bucket...' : 'Upload File'}
                </button>
              </div>
            </form>

            {/* Document List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#007AFF]">
                Uploaded Records in Firestore Subcollection: <code className="font-mono text-[#8E8E93]">tenants/{selectedTenantForDocs.tenantId}/documents</code>
              </h4>

              {selectedTenantForDocs.documents && selectedTenantForDocs.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedTenantForDocs.documents.map((doc) => (
                    <div
                      key={doc.docId}
                      className="p-3.5 bg-[#F2F2F7] rounded-2xl border border-black/[0.04] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white text-[#007AFF] flex items-center justify-center font-bold shrink-0 shadow-xs">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-[#1C1C1E]">{doc.name}</div>
                          <div className="text-[11px] text-[#8E8E93] font-mono">
                            {doc.storagePath} • {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-white text-[#1C1C1E] text-[10px] font-semibold uppercase shadow-xs">
                        {doc.type.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#8E8E93] bg-[#F2F2F7] rounded-2xl">
                  No files uploaded in this tenant's Firebase Storage subfolder.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-black/[0.05]">
              <button
                onClick={() => setSelectedTenantForDocs(null)}
                className="px-4 py-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] rounded-xl text-xs font-semibold active:scale-95 transition-all"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation iOS Alert Modal */}
      {tenantToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-black/[0.06] text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1C1C1E]">
                Delete Tenant Record?
              </h3>
              <p className="text-xs text-[#8E8E93]">
                Are you sure you want to delete <span className="font-semibold text-[#1C1C1E]">"{tenantToDelete.legalName}"</span>? This will detach assigned unit #{tenantToDelete.assignedUnitId}.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTenantToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-semibold active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTenant}
                className="flex-1 py-2.5 rounded-xl bg-[#FF3B30] hover:bg-[#D70015] text-white text-xs font-semibold active:scale-95 transition-all shadow-md shadow-red-500/20"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
