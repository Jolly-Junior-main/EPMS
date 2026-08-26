import React, { useState } from 'react';
import { usePMS } from '../../context/PMSContext';
import { SupportTicketStatus, SupportTicketPriority } from '../../types/superAdmin';
import {
  LifeBuoy,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Building2,
  User,
  Plus
} from 'lucide-react';

export const SupportTicketsManager: React.FC = () => {
  const { supportTickets, updateSupportTicketStatus, createSupportTicket, organizations, t } = usePMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportTicketStatus>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredTickets = supportTickets.filter((tkt) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      tkt.ticketNumber.toLowerCase().includes(term) ||
      tkt.subject.toLowerCase().includes(term) ||
      tkt.organizationName.toLowerCase().includes(term) ||
      tkt.createdByName.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || tkt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedTicket = supportTickets.find((t) => t.ticketId === selectedTicketId) || filteredTickets[0];

  const handleResolve = () => {
    if (!selectedTicket) return;
    updateSupportTicketStatus(selectedTicket.ticketId, 'resolved', replyText || 'Issue investigated and resolved by Super Admin.');
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 md:p-8 border border-black/[0.04] dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[#007AFF]/10 text-[#007AFF] font-mono">
              CLIENT ASSISTANCE &amp; INCIDENT DESK
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            {t('ticket_title', 'Support Tickets Console')}
          </h2>
          <p className="text-xs md:text-sm text-[#8E8E93] mt-0.5">
            {t('ticket_subtitle', 'Triage technical inquiries, SMS delivery disputes, and billing queries submitted by client organizations.')}
          </p>
        </div>
      </div>

      {/* Grid Layout: Ticket List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/[0.06] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-black/5 dark:bg-white/5 text-[#8E8E93]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.ticketId}
                onClick={() => setSelectedTicketId(tkt.ticketId)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedTicket?.ticketId === tkt.ticketId
                    ? 'border-[#007AFF] bg-[#007AFF]/5 dark:bg-[#007AFF]/10'
                    : 'border-black/[0.04] dark:border-white/5 hover:border-black/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1 font-mono">
                  <span>{tkt.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                      tkt.priority === 'urgent'
                        ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                        : tkt.priority === 'high'
                        ? 'bg-[#FF9500]/10 text-[#FF9500]'
                        : 'bg-[#34C759]/10 text-[#34C759]'
                    }`}
                  >
                    {tkt.priority}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#1C1C1E] dark:text-white line-clamp-1">
                  {tkt.subject}
                </h4>
                <div className="text-[11px] text-[#8E8E93] mt-1 flex items-center justify-between">
                  <span className="truncate">{tkt.organizationName}</span>
                  <span className="capitalize text-[10px] font-semibold">{tkt.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Resolution */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/[0.04] dark:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6 flex flex-col justify-between space-y-6">
          {selectedTicket ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-black/[0.05] dark:border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#007AFF]">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/5 dark:bg-white/10 text-[#8E8E93]">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1C1E] dark:text-white mt-1">
                    {selectedTicket.subject}
                  </h3>
                  <div className="text-xs text-[#8E8E93] mt-1 flex items-center gap-2">
                    <span>Client: <strong className="text-[#1C1C1E] dark:text-white">{selectedTicket.organizationName}</strong></span>
                    <span>•</span>
                    <span>By: {selectedTicket.createdByName} ({selectedTicket.createdByEmail})</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedTicket.status === 'resolved'
                      ? 'bg-[#34C759]/10 text-[#34C759]'
                      : selectedTicket.status === 'in_progress'
                      ? 'bg-[#007AFF]/10 text-[#007AFF]'
                      : 'bg-[#FF9500]/10 text-[#FF9500]'
                  }`}
                >
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>

              {/* Inquiry Message */}
              <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] p-4 rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
                  Client Inquiry Description
                </div>
                <p className="text-xs text-[#1C1C1E] dark:text-white leading-relaxed whitespace-pre-line">
                  {selectedTicket.description}
                </p>
                <div className="text-[10px] text-[#8E8E93] pt-2 border-t border-black/5 dark:border-white/5">
                  Submitted on {new Date(selectedTicket.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Resolution Notes (if any) */}
              {selectedTicket.resolutionNotes && (
                <div className="bg-[#34C759]/10 border border-[#34C759]/20 p-4 rounded-2xl space-y-1 text-xs">
                  <div className="font-bold text-[#34C759] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Resolution Notes
                  </div>
                  <p className="text-[#1C1C1E] dark:text-white">
                    {selectedTicket.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Super Admin Response / Resolve Box */}
              <div className="space-y-3 pt-4 border-t border-black/[0.05] dark:border-white/10">
                <label className="text-xs font-bold text-[#1C1C1E] dark:text-white block">
                  Super Admin Resolution / Response
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter resolution notes, API remedy details, or client response..."
                  className="w-full p-3 text-xs rounded-xl border border-black/[0.08] dark:border-white/10 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#1C1C1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => updateSupportTicketStatus(selectedTicket.ticketId, 'in_progress', replyText)}
                    className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-bold text-[#1C1C1E] dark:text-white rounded-xl transition-all cursor-pointer"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={handleResolve}
                    className="px-4 py-2 bg-[#34C759] hover:bg-[#2EB150] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Resolve Ticket
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#8E8E93]">
              Select a support ticket from the list to view inquiry details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
