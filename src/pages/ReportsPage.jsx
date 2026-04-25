import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import GlowCard from '../components/ui/GlowCard';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/formatters';
import { FileText, Plus, Edit2, Trash2, MapPin, Search } from 'lucide-react';

const ReportsPage = () => {
  const { reports, addReport, updateReport, deleteReport, currentCity } = useAppContext();
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    observation: '',
    riskLevel: 'Moderate',
    tags: ''
  });

  const reportsPerPage = 5;

  // Filter and Sort Reports
  const filteredReports = useMemo(() => {
    return reports
      .filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.observation.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [reports, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage, 
    currentPage * reportsPerPage
  );

  const handleOpenModal = (report = null) => {
    if (report) {
      setEditingId(report.id);
      setFormData({
        title: report.title,
        observation: report.observation,
        riskLevel: report.riskLevel,
        tags: report.tags?.join(', ') || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', observation: '', riskLevel: 'Moderate', tags: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingId) {
      updateReport(editingId, dataToSave);
    } else {
      addReport(dataToSave);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this observation report permanently?")) {
      deleteReport(id);
      // Adjust page if deleting last item on current page
      if (currentReports.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-[fade-in_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-green)] mb-1">
            OBSERVATION LOGS
          </h1>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-orbitron">
            Field Reports & Data Analysis
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--color-space-700)] hover:bg-[var(--color-space-600)] border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] px-4 py-2 rounded flex items-center gap-2 transition-colors glow-cyan"
        >
          <Plus size={18} />
          <span className="font-orbitron text-sm uppercase tracking-wider">New Log</span>
        </button>
      </div>

      <GlowCard color="cyan" className="p-0 overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-gray-800 bg-[rgba(0,0,0,0.2)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 rounded pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon-cyan)]"
            />
          </div>
          <div className="text-sm text-gray-400 font-inter">
            Total Records: <span className="text-[var(--color-neon-cyan)] font-bold">{filteredReports.length}</span>
          </div>
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-800">
          {currentReports.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <FileText size={48} className="mb-4 opacity-20" />
              <p>No observation logs found in the system.</p>
            </div>
          ) : (
            currentReports.map(report => (
              <div key={report.id} className="p-6 hover:bg-[rgba(0,240,255,0.02)] transition-colors group">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white font-inter">{report.title}</h3>
                      <StatusBadge status={report.riskLevel} />
                    </div>
                    <p className="text-sm text-gray-300 mb-4 whitespace-pre-wrap">{report.observation}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-[var(--color-neon-cyan)]" /> {report.city}</span>
                      <span>{formatDate(report.timestamp / 1000)}</span>
                      {report.tags && report.tags.length > 0 && (
                        <div className="flex gap-1">
                          {report.tags.map((tag, i) => (
                            <span key={i} className="bg-[var(--color-space-800)] px-2 py-0.5 rounded border border-gray-700">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(report)}
                      className="p-2 text-gray-400 hover:text-[var(--color-neon-cyan)] bg-[var(--color-space-800)] rounded border border-gray-700 hover:border-[var(--color-neon-cyan)] transition-colors"
                      title="Edit Log"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="p-2 text-gray-400 hover:text-[var(--color-neon-red)] bg-[var(--color-space-800)] rounded border border-gray-700 hover:border-[var(--color-neon-red)] transition-colors"
                      title="Delete Log"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-800 bg-[rgba(0,0,0,0.2)] flex justify-between items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[var(--color-space-800)] border border-gray-700 text-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400 font-orbitron">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[var(--color-space-800)] border border-gray-700 text-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </GlowCard>

      {/* Modal for Create/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Observation Log" : "New Observation Log"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div className="bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.2)] p-3 rounded mb-4 flex items-start gap-2">
              <MapPin size={16} className="text-[var(--color-neon-cyan)] mt-0.5 shrink-0" />
              <p className="text-xs text-[var(--color-neon-cyan)]">Log will be attached to current telemetry location: <strong className="font-orbitron">{currentCity.name}</strong></p>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-orbitron text-gray-400 uppercase tracking-widest mb-1">Subject / Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:border-[var(--color-neon-cyan)]"
              placeholder="e.g. Unusually high PM2.5 levels"
            />
          </div>
          
          <div>
            <label className="block text-xs font-orbitron text-gray-400 uppercase tracking-widest mb-1">Risk Assessment</label>
            <select 
              value={formData.riskLevel}
              onChange={(e) => setFormData({...formData, riskLevel: e.target.value})}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:border-[var(--color-neon-cyan)] appearance-none"
            >
              <option value="Safe">Safe (Green)</option>
              <option value="Moderate">Moderate (Amber)</option>
              <option value="Dangerous">Dangerous (Red)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-orbitron text-gray-400 uppercase tracking-widest mb-1">Detailed Observation</label>
            <textarea 
              required
              rows="4"
              value={formData.observation}
              onChange={(e) => setFormData({...formData, observation: e.target.value})}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:border-[var(--color-neon-cyan)] resize-none"
              placeholder="Enter detailed field notes..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-orbitron text-gray-400 uppercase tracking-widest mb-1">Tags (comma separated)</label>
            <input 
              type="text" 
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full bg-[var(--color-space-800)] border border-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:border-[var(--color-neon-cyan)]"
              placeholder="e.g. smog, urgent, review"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-[var(--color-space-700)] border border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] rounded hover:bg-[rgba(0,240,255,0.1)] transition-colors glow-cyan font-orbitron uppercase tracking-wider text-sm"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
