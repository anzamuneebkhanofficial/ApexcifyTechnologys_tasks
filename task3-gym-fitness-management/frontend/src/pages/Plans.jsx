import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { FileText, Download, Plus, Trash2, Edit, Dumbbell } from 'lucide-react';
import { getImageUrl } from '../utils/helpers.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  min-height: 100vh;
  @media (max-width: 768px) { margin-left: 0; padding: 20px; }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
  h1 { font-size: 2rem; font-weight: 800; }
`;

const UploadCard = styled.div`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 32px;

  h2 { font-size: 1.3rem; margin-bottom: 20px; }

  form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  input, select, textarea {
    padding: 12px 14px;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 0.9rem;
    width: 100%;
    font-family: inherit;
    &:focus { outline: none; border-color: var(--primary); }
  }
  textarea { min-height: 90px; resize: vertical; }
`;

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PlanItem = styled.div`
  padding: 22px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  transition: all 0.2s;

  &:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-3px); }

  h3 { font-size: 1rem; color: var(--primary); }
  .meta { font-size: 0.78rem; color: var(--text-muted); }
  p { font-size: 0.88rem; line-height: 1.6; }

  .actions {
    position: absolute;
    top: 14px;
    right: 14px;
    display: flex;
    gap: 6px;
    opacity: 0;
    transition: opacity 0.25s;

    button {
      padding: 5px 7px;
      border-radius: 8px;
      background: rgba(0,0,0,0.4);
      color: #fff;
      border: none;
      cursor: pointer;
      &:hover { background: var(--primary); color: #000; }
    }
  }
  &:hover .actions { opacity: 1; }
`;

const TypeBadge = styled.span`
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ type }) => type === 'Workout' ? 'rgba(0,242,254,0.12)' : 'rgba(255,8,68,0.12)'};
  color: ${({ type }) => type === 'Workout' ? '#00f2fe' : '#ff0844'};
`;

const Plans = () => {
  const { userData } = useAuth();
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadData, setUploadData] = useState({
    title: '', type: 'Workout', description: '', assignedTo: '', file: null
  });

  const canEdit = userData?.role === 'Admin' || userData?.role === 'Trainer';

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const endpoint = canEdit ? '/plans/all' : '/plans';
      const res = await api.get(endpoint);
      setPlans(res.data);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!canEdit) return;
    try {
      const res = await api.get('/users/members');
      setMembers(res.data);
    } catch (err) { }
  };

  useEffect(() => {
    fetchPlans();
    fetchMembers();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('type', uploadData.type);
    formData.append('description', uploadData.description);
    formData.append('assignedTo', uploadData.assignedTo);
    if (uploadData.file) formData.append('planFile', uploadData.file);

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, formData);
        toast.success('Plan updated!');
      } else {
        await api.post('/plans', formData);
        toast.success('Plan uploaded!');
      }
      setShowUpload(false);
      setEditingId(null);
      setUploadData({ title: '', type: 'Workout', description: '', assignedTo: '', file: null });
      fetchPlans();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await api.delete(`/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setUploadData({
      title: p.title,
      type: p.type,
      description: p.description,
      assignedTo: p.assignedTo?._id || '',
      file: null
    });
    setShowUpload(true);
  };

  const cancelUpload = () => {
    setShowUpload(false);
    setEditingId(null);
    setUploadData({ title: '', type: 'Workout', description: '', assignedTo: '', file: null });
  };

  return (
    <PageContainer>
      <SectionHeader>
        <div>
          <h1>Workout &amp; Diet Plans</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
            {canEdit ? 'Create and assign fitness plans to members' : 'Your assigned workout and diet plans'}
          </p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => showUpload ? cancelUpload() : setShowUpload(true)}>
            <Plus size={20} /> {showUpload ? 'Cancel' : 'Add Plan'}
          </button>
        )}
      </SectionHeader>


      {showUpload && (
        <UploadCard className="glass">
          <h2>{editingId ? 'Edit Plan' : 'New Plan'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <input
                type="text"
                placeholder="Plan Title"
                value={uploadData.title}
                required
                onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
              />
              <select value={uploadData.type} onChange={e => setUploadData({ ...uploadData, type: e.target.value })}>
                <option value="Workout">Workout Plan</option>
                <option value="Diet">Diet Plan</option>
              </select>
            </div>

            <select
              value={uploadData.assignedTo}
              required
              onChange={e => setUploadData({ ...uploadData, assignedTo: e.target.value })}
            >
              <option value="">— Assign to Member —</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
              ))}
            </select>

            <textarea
              placeholder="Instructions / Description"
              value={uploadData.description}
              rows={4}
              onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
            />

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                {editingId ? 'Replace File (optional — PDF or Image)' : 'Upload File (PDF or Image)'}
              </label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Saving…' : (editingId ? 'Save Changes' : 'Upload Plan')}
              </button>
              <button type="button" className="btn-secondary" onClick={cancelUpload}>Cancel</button>
            </div>
          </form>
        </UploadCard>
      )}


      {loading ? (
        <LoadingSpinner message="Loading plans…" />
      ) : plans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Dumbbell size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>No Plans Yet</h3>
          <p>{canEdit ? 'Create a plan and assign it to a member.' : 'No plans have been assigned to you yet.'}</p>
        </div>
      ) : (
        <PlanGrid>
          {plans.map(p => (
            <PlanItem key={p._id} className="glass">
              {(userData?.role === 'Admin' || (userData?.role === 'Trainer' && p.assignedBy?._id === userData._id)) && (
                <div className="actions">
                  <button onClick={() => openEdit(p)} title="Edit"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(p._id)} style={{ color: '#f87171' }} title="Delete"><Trash2 size={14} /></button>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TypeBadge type={p.type}>{p.type}</TypeBadge>
                <span className="meta">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <h3>{p.title}</h3>
              {(canEdit || userData?.role === 'Admin') && (
                <div className="meta">
                  Assigned to: <strong style={{ color: 'var(--text-main)' }}>{p.assignedTo?.name || '—'}</strong>
                  &nbsp;·&nbsp;By: {p.assignedBy?.name || '—'}
                </div>
              )}
              <p>{p.description}</p>
              {p.fileUrl && (
                <a
                  href={getImageUrl(p.fileUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.85rem' }}
                >
                  <Download size={15} /> View / Download
                </a>
              )}
            </PlanItem>
          ))}
        </PlanGrid>
      )}
    </PageContainer>
  );
};

export default Plans;
