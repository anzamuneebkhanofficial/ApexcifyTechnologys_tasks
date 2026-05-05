import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import { FileText, Calendar, DollarSign, Plus, Trash2, Edit } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 260px;
  @media (max-width: 768px) { margin-left: 0; }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  h1 { font-size: 2rem; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const TenderCard = styled.div`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => {
      if (props.status === 'Open') return '#4ade80';
      if (props.status === 'Closed') return '#f87171';
      return '#fbbf24';
    }};
  }

  .status-badge {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(255,255,255,0.05);
  }

  .title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
  .desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px; line-height: 1.6; }
  
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
    
    .item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
      color: var(--text-muted);
      
      svg { color: var(--primary); }
      span { color: #fff; font-weight: 600; }
    }
  }

  .actions {
    display: flex;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #1e293b;
  width: 100%;
  max-width: 550px;
  border-radius: 28px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    label { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
    input, select, textarea {
      padding: 14px;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: #fff;
      font-size: 0.95rem;
      &:focus { border-color: var(--primary); outline: none; }
    }
    textarea { height: 100px; resize: none; }
  }
`;

const Tenders = () => {
  const [tenders, setTenders]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    status: 'Open'
  });

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tenders');
      setTenders(res.data);
    } catch (err) {
      toast.error('Failed to fetch tenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/tenders/${editingId}`, formData);
        toast.success('Tender updated!');
      } else {
        await api.post('/tenders', formData);
        toast.success('Tender created!');
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', budget: '', deadline: '', status: 'Open' });
      fetchTenders();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tender?")) return;
    try {
      await api.delete(`/tenders/${id}`);
      toast.success("Tender deleted");
      fetchTenders();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openEdit = (tender) => {
    setEditingId(tender._id);
    setFormData({
      title: tender.title,
      description: tender.description,
      budget: tender.budget,
      deadline: tender.deadline.split('T')[0],
      status: tender.status
    });
    setShowModal(true);
  };

  return (
    <PageContainer>
      <SectionHeader>
        <h1>Gym Tenders</h1>
        {userData?.role === 'Admin' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Create Tender
          </button>
        )}
      </SectionHeader>

      {loading ? (
        <LoadingSpinner message="Loading tenders…" />
      ) : tenders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ marginBottom: 16, opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-main)', marginBottom: 8 }}>No Tenders Posted</h3>
          <p>Create a tender to source gym equipment and services.</p>
        </div>
      ) : (
      <Grid>
        {tenders.map(t => (
          <TenderCard key={t._id} status={t.status}>
            <div className="status-badge">{t.status}</div>
            <div className="title">{t.title}</div>
            <p className="desc">{t.description}</p>
            
            <div className="meta">
              <div className="item">
                <DollarSign size={16} />
                PKR <span>{t.budget.toLocaleString()}</span>
              </div>
              <div className="item">
                <Calendar size={16} />
                Deadline: <span>{new Date(t.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            {userData?.role === 'Admin' && (
              <div className="actions">
                <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => openEdit(t)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="btn-secondary" style={{ flex: 1, padding: '10px', color: '#f87171' }} onClick={() => handleDelete(t._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </TenderCard>
        ))}
      </Grid>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <h2 style={{ marginBottom: 32 }}>{editingId ? 'Edit Tender' : 'Create New Tender'}</h2>
            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tender Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  required 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. New Treadmills Supply"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description}
                  required
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Detailed requirements..."
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label>Budget (PKR)</label>
                  <input 
                    type="number" 
                    value={formData.budget}
                    required 
                    onChange={e => setFormData({...formData, budget: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input 
                    type="date" 
                    value={formData.deadline}
                    required 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                  />
                </div>
              </div>

              {editingId && (
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Awarded">Awarded</option>
                  </select>
                </div>
              )}

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={submitting}>
                    {submitting ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Tender')}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>Cancel</button>
                </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Tenders;
